import { nodeResolve } from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';

import pkg from './package.json' assert { type: 'json' };

export default {
  input: 'src/fetus.ts',
  output: [
    {
      file: pkg.main,
      format: 'cjs',
      sourcemap: true,
      inlineDynamicImports: true,
    },
    {
      file: pkg.module,
      format: 'es',
      sourcemap: true,
      inlineDynamicImports: true,
    },
  ],
  plugins: [typescript(), nodeResolve()],
};
