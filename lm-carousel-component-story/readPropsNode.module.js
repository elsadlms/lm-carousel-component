export default function readPropsNode (propsNode) {
    const nodeDataType = propsNode.dataset['type']
    const unnamedDataChildren = [...propsNode.querySelectorAll(':scope > data:not([data-title])')]
    const namedDataChildren = [...propsNode.querySelectorAll(':scope > data[data-title]:not([data-title=""])')]
    const dataChildren = [...unnamedDataChildren, ...namedDataChildren]
  
    if (dataChildren.length === 0) {
      // No data children => return the value of innerHTML
      const rawNodeVal = propsNode.innerHTML.trim()
      if (nodeDataType === 'number') return parseFloat(rawNodeVal)
      if (nodeDataType === 'boolean') {
        const normalizedRawValue = rawNodeVal.toLowerCase().trim()
        const trueishValues = ['oui', 'yes', 'vrai', 'true', '1']
        return trueishValues.includes(normalizedRawValue)
      }
      else if (nodeDataType === 'null') return null
      else return rawNodeVal
  
    } else if (namedDataChildren.length === 0) {
      // With only unnamed data children
      return unnamedDataChildren.map(dataChild => readPropsNode(dataChild))
  
    } else {
      // With named data children (unnamed are ignored)
      const returned = {}
      dataChildren.forEach(dataChild => {
        const title = dataChild.dataset['title']
        if (typeof title !== 'string' || title.length < 1) return
        returned[title] = readPropsNode(dataChild)
      })
      return returned
    }
  }