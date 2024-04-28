const gulp = require('gulp');
const less = require('gulp-less');
const path = require('path');
const postcss = require('gulp-postcss'); // 引入gulp-postcss
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const babel = require('gulp-babel');
const ts = require('gulp-typescript');
const webpackStream = require('webpack-stream');
const webpack = require('webpack');
const through = require('through2');
const tsconfig = require('./tsconfig.json');
const shell = require('gulp-shell');
const gulpIf = require('gulp-if');

const isTypeScriptSource = (file) =>
  /\.tsx?$/.test(file.path) && !file.path.endsWith('.d.ts');

const clean = shell.task(['rm -rf ./lib/**']);

// /**
//  * 自动删除上一次打包生成的资源文件（确保每次打包的都是最新的资源）
//  * @returns
//  */
// function clean() {
//   return del('./lib/**');
// }

function buildStyle() {
  const plugins = [
    autoprefixer(), // 使用autoprefixer自动添加CSS前缀
    cssnano(), // 使用cssnano进行CSS压缩
  ];
  return gulp
    .src(['./src/**/*.less'], {
      base: './src/',
      ignore: ['**/demos/**/*', '**/tests/**/*'],
    })
    .pipe(
      less({
        paths: [path.join(__dirname, 'src')],
        relativeUrls: true,
      }),
    )
    .pipe(postcss(plugins))
    .pipe(gulp.dest('./lib/es'))
    .pipe(gulp.dest('./lib/cjs'));
}

function copyAssets() {
  return gulp
    .src('./src/assets/**/*')
    .pipe(gulp.dest('lib/assets'))
    .pipe(gulp.dest('lib/es/assets'))
    .pipe(gulp.dest('lib/cjs/assets'));
}

function buildCJS() {
  return gulp
    .src(['lib/es/**/*.js'])
    .pipe(
      babel({
        plugins: ['@babel/plugin-transform-modules-commonjs'],
      }),
    )
    .pipe(gulp.dest('lib/cjs/'));
}

function buildES() {
  const tsProject = ts({ ...tsconfig.compilerOptions, module: 'ESNext' });
  return gulp
    .src(['src/**/*.{ts,tsx}', '!src/**/*.d.ts'], {
      ignore: ['**/demos/**/*', '**/tests/**/*'],
    })
    .pipe(tsProject)
    .pipe(gulpIf(isTypeScriptSource, babel())) // 仅对 TypeScript 源文件应用 Babel
    .pipe(gulp.dest('lib/es/'));
}

function buildDeclaration() {
  const tsProject = ts({
    ...tsconfig.compilerOptions,
    module: 'ESNext',
    declaration: true,
    emitDeclarationOnly: true,
  });
  return gulp
    .src(['src/**/*.{ts,tsx}'], {
      ignore: ['**/demos/**/*', '**/tests/**/*'],
    })
    .pipe(tsProject)
    .pipe(gulp.dest('lib/es/'))
    .pipe(gulp.dest('lib/cjs/'));
}

function copyMetaFiles() {
  return gulp.src(['./README.md', './LICENSE.txt']).pipe(gulp.dest('./lib/'));
}

function generatePackageJSON() {
  return gulp
    .src('./package.json')
    .pipe(
      through.obj((file, enc, cb) => {
        const rawJSON = file.contents.toString();
        const parsed = JSON.parse(rawJSON);
        delete parsed.scripts;
        delete parsed.devDependencies;
        delete parsed.publishConfig;
        const stringified = JSON.stringify(parsed, null, 2);
        file.contents = Buffer.from(stringified);
        cb(null, file);
      }),
    )
    .pipe(gulp.dest('./lib/'));
}

function umdWebpack() {
  return gulp
    .src('lib/es/index.js')
    .pipe(
      webpackStream(
        {
          output: {
            filename: 'RLib.js',
            library: {
              type: 'umd',
              name: 'RLib',
            },
          },
          mode: 'production',
          optimization: {
            usedExports: true,
          },
          resolve: {
            extensions: ['.js', '.json'],
          },
          module: {
            rules: [
              {
                test: /\.(png|svg|jpg|gif|jpeg)$/,
                type: 'asset/inline',
              },
              {
                test: /\.css$/i,
                use: ['style-loader', 'css-loader'],
              },
            ],
          },
          externals: [
            {
              react: 'React',
            },
          ],
        },
        webpack,
      ),
    )
    .pipe(gulp.dest('lib/umd/'));
}

exports.umdWebpack = umdWebpack;

exports.default = gulp.series(
  clean,
  buildES,
  gulp.parallel(buildCJS, buildDeclaration, buildStyle),
  // copyAssets,
  // copyMetaFiles,
  generatePackageJSON,
  gulp.parallel(umdWebpack),
);
