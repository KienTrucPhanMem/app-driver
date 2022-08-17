export function phoneValidator(phone) {
  const re = /(84|0[3|5|7|8|9])+([0-9]{8})/;
  if (!phone) return "Phone can't be empty.";
  if (!re.test(phone)) return 'Ooops! We need a valid phone number.';
  return '';
}
