import { expressApp } from './server';

expressApp.listen(4200, () => {
  console.log('Listening on port 4200');
});
