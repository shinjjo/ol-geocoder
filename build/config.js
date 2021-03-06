import { readFileSync } from 'fs';
import { minify } from 'uglify-es';
import nodeResolve from 'rollup-plugin-node-resolve';
import json from 'rollup-plugin-json';
import buble from 'rollup-plugin-buble';
import commonjs from 'rollup-plugin-commonjs';
import eslint from 'rollup-plugin-eslint';
import includePaths from 'rollup-plugin-includepaths';
import bundleSize from 'rollup-plugin-filesize';
import uglify from 'rollup-plugin-uglify';

const pkg = JSON.parse(readFileSync('./package.json', 'utf-8'));
const external = Object.keys(pkg.dependencies);
const globals = {};

const ol = [
  ['ol/control/control', 'ol.control.Control'],
  ['ol/style/style', 'ol.style.Style'],
  ['ol/style/icon', 'ol.style.Icon'],
  ['ol/layer/vector', 'ol.layer.Vector'],
  ['ol/source/vector', 'ol.source.Vector'],
  ['ol/geom/point', 'ol.geom.Point'],
  ['ol/proj', 'ol.proj'],
  ['ol/feature', 'ol.Feature'],
];

ol.forEach(each => {
  external.push(each[0]);
  globals[each[0]] = each[1];
});

const lintOpts = {
  // extensions: ['js'],
  exclude: ['**/*.json'],
  cache: true,
  throwOnError: true
};

const includePathOptions = {
  paths: ['', './src']
};

const banner = readFileSync('./build/banner.js', 'utf-8')
  .replace('${name}', pkg.name)
  .replace('${description}', pkg.description)
  .replace('${homepage}', pkg.homepage)
  .replace('${version}', pkg.version)
  .replace('${time}', new Date());

export default [
  {
    external,
    input: './src/base.js',
    output: {
      banner,
      globals,
      file: './dist/ol-geocoder.js',
      format: 'umd',
      name: 'Geocoder',
    },
    plugins: [
      includePaths(includePathOptions),
      eslint(lintOpts),
      bundleSize(),
      nodeResolve(),
      commonjs(),
      json({ exclude: 'node_modules/**' }),
      buble({ target: { ie: 11 } }),
      uglify({ output: { comments: /^!/ } }, minify)
    ],
  },
  {
    external,
    input: './src/base.js',
    output: {
      banner,
      globals,
      file: './dist/ol-geocoder-debug.js',
      format: 'umd',
      name: 'Geocoder',
    },
    plugins: [
      includePaths(includePathOptions),
      eslint(lintOpts),
      bundleSize(),
      nodeResolve(),
      commonjs(),
      json({ exclude: 'node_modules/**' }),
      buble({ target: { ie: 11 } })
    ],
  }
];
