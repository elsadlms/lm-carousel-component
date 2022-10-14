export const getValue = (ref) => {
  const input = ref.current;
  if (!input) return
  if (input.dataset && input.dataset.value) return input.dataset.value
  if (input.type === "checkbox") return input.checked
  if (input.type === "number") return Number(input.value)
  else return input.value
}