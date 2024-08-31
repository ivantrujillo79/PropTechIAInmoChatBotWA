import typescript from 'rollup-plugin-typescript2'

export default {
    input: 'src/ninosheroes.ts',
    output: {
        file: 'dist/ninosheroes.js',
        format: 'esm',
    },
    onwarn: (warning) => {
        if (warning.code === 'UNRESOLVED_IMPORT') return
    },
    plugins: [typescript()],
}
