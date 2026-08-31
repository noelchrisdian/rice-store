const escape = (string) => {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

export { escape }
