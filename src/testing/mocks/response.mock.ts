export function response(args?: any) {
  return {
    status: (_code: number) => ({
      send: (..._body: any) => { },
    }),
    send: (..._body: any) => { },
    json: (..._body: any) => { },
    set: (_header: string, _value: string) => { },
    once: (_e: string, cb: () => void) => { cb(); },
    ...args,
  };
}
