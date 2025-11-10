const canUseDOM: boolean = Boolean(
  typeof window !== 'undefined' && window.document?.createElement,
)

export default canUseDOM

