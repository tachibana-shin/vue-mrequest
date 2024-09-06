import type { OptionsRequest } from "./composibles/request"

export const globalOptions: OptionsRequest<any, any> = {}
export function setGlobalOptions(options: OptionsRequest<any, any>) {
  Object.assign(globalOptions, options)
}
