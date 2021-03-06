import {rollup} from 'rollup';
import nodeResolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import babel from 'rollup-plugin-babel';
import babelrc from 'babelrc-rollup';
import {minify} from 'uglify-js';
import fs from 'fs';

const pkg = require('./package.json');
const external = !!pkg.dependencies ? Object.keys(pkg.dependencies) : [];

/*
 create the lib for publishing to npm
 */

rollup({
  entry: 'src/vanilla-tilt.js',
  plugins: [
    nodeResolve({
      module: true,
      jsnext: true,
      main: true,
    })
  ],
  external: external
}).then(bundle => bundle.write({
  dest: pkg.module,
  format: 'es'
})).catch(err => console.log(err.stack));

rollup({
  entry: 'src/vanilla-tilt.js',
  plugins: [
    nodeResolve({
      module: true,
      jsnext: true,
      main: true,
    }),
    babel(babelrc()),
    commonjs()
  ],
  external: external
}).then(bundle => bundle.write({
  dest: pkg.main,
  format: 'cjs'
})).catch(err => console.log(err.stack));


/*
 create dist for using as script in html
 */
rollup({
  entry: 'src/vanilla-tilt.js',
  plugins: [
    nodeResolve({
      module: true,
      jsnext: true,
      main: true,
    })
  ],
  external: external
}).then((bundle) => {
  bundle.write({
    moduleName: 'VanillaTilt',
    format: 'iife',
    dest: pkg.dist,
  }).then(() => {
    const code = minify(pkg.dist, {
      mangle: {except: ['VanillaTilt']}
    }).code;

    fs.writeFileSync(pkg.dist.replace('.js', '.min.js'), code);
    return bundle;
  })
}).catch(err => console.log(err.stack));

rollup({
  entry: 'src/vanilla-tilt.js',
  plugins: [
    nodeResolve({
      module: true,
      jsnext: true,
      main: true
    }),
    babel(babelrc()),
    commonjs()
  ],
  external: external
}).then((bundle) => {
  const dest = pkg.dist.replace('.js', '.babel.js');
  bundle.write({
    moduleName: 'VanillaTilt',
    format: 'iife',
    dest: dest,
  })
    .then(() => {
      const code = minify(dest, {
        mangle: {except: ['VanillaTilt']}
      }).code;

      fs.writeFileSync(dest.replace('.js', '.min.js'), code);
      return bundle;
    })

}).catch(err => console.log(err.stack));
