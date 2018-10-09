import { Controller } from '../../../../../..'

class Index extends Controller {
  actionIndex (): string {
    return this.service('test').getName('salak')
  }
}

export default Index
