export default function getById(...ids: string[]) {
  return ids.map((id) => document.getElementById(id));
}
