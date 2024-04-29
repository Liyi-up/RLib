const gulp = require('gulp');
const postcss = require('gulp-postcss');
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
const uglify = require('gulp-uglify');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

const isTypeScriptSource = (file) =>
  /\.tsx?$/.test(file.path) && !file.path.endsWith('.d.ts');

const clean = shell.task(['rm -rf ./lib/**']);

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
    .pipe(gulpIf(isTypeScriptSource, babel()))
    .pipe(gulp.dest('lib/es/'));
}

function copyCSS() {
  const plugins = [
    autoprefixer(), // 使用autoprefixer自动添加CSS前缀
    cssnano(), // 使用cssnano进行CSS压缩
  ];
  return gulp
    .src('./src/**/output.css')
    .pipe(postcss(plugins))
    .pipe(gulp.dest('./lib/es'))
    .pipe(gulp.dest('./lib/cjs'));
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
          plugins: [
            new BundleAnalyzerPlugin({
              analyzerMode: 'static',
              openAnalyzer: true, // 自动打开分析报告HTML
            }),
          ],
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

function compressJs() {
  return gulp
    .src(['lib/es/**/*.js', 'lib/cjs/**/*.js'], { base: './' })
    .pipe(uglify())
    .pipe(gulp.dest('./'));
}

exports.umdWebpack = umdWebpack;

exports.default = gulp.series(
  clean,
  buildES,
  gulp.parallel(buildCJS, buildDeclaration, copyCSS),
  compressJs,
  generatePackageJSON,
  gulp.parallel(umdWebpack),
);
