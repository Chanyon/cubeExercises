export interface ThreeStyleInfo {
  edge: {},
  corners: {
    base: Array<{
      encoder: string,
      commutator: string,
      detailed: string,
      block?: string,
      step: string,
      possible?: string
    }>
    all: {
      [key in string]: Array<{
        encoder: string,
        commutator: string,
        detailed: string,
        block?: string,
        step: string,
        possible?: string
      }>
    }
  }
}