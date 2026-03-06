import config from '../../vite.config.default';

export default config('src/index.ts', 'rrweb', {
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
