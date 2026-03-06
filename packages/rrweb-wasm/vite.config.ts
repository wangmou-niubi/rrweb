import path from 'path';
import config from '../../vite.config.default';

export default config(path.resolve(__dirname, 'src/index.ts'), 'rrwebWasm', {
  fileName: 'rrweb-wasm',
  plugins: [
    {
      name: 'rrweb-wasm-external',
      config() {
        return {
          build: {
            rollupOptions: {
              external: ['@rrweb/wasm/wasm'],
            },
          },
        };
      },
    },
  ],
});
