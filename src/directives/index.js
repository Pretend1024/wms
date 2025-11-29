import { inputNumber } from './inputNumber'
import { inputInteger } from './inputInteger'
import { permission } from './permission'

export function setupDirectives(app) {
    // 注册 v-number
    app.directive('number', inputNumber)
    
    // 注册 v-intNumber
    app.directive('intNumber', inputInteger)
    
    // 注册 v-permission
    app.directive('permission', permission)
}