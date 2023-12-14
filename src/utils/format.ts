import moment from "moment";

export function formatDate(dateString: string) {
  return moment(dateString).format('YYYY-MM-DD HH:mm:ss')
}

export function formatMoney(money: number) {
  return (money / 100).toFixed(2)
}
