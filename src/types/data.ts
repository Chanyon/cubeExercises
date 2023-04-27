export interface ThreeStyleInfo {
  edge: {
    base: Array<ThreeStyleInfoItem>
    all: {
      [key in string]: Array<ThreeStyleInfoItem>
    }
  },
  corners: {
    base: Array<ThreeStyleInfoItem>
    all: {
      [key in string]: Array<ThreeStyleInfoItem>
    }
  }
}

export interface ThreeStyleInfoItem {
  encoder: string,
  commutator: string,
  detailed: string,
  block?: string,
  step: string,
  possible?: string
} 