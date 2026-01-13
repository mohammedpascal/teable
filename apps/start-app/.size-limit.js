// Size limit configuration for Vite build
// @link https://github.com/ai/size-limit

module.exports = [
  {
    name: 'Main bundle',
    path: ['dist/assets/*.js'],
    limit: '500kb',
  },
  {
    name: 'CSS',
    path: ['dist/assets/*.css'],
    limit: '50kb',
  },
];
