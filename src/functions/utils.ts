export const formatPhone = (val: string): string => {
  const v = val.replace(/\D/g, '').slice(0, 10);
  if (v.length > 3 && v.length <= 6) return v.slice(0, 3) + '-' + v.slice(3);
  if (v.length > 6) return v.slice(0, 3) + '-' + v.slice(3, 6) + '-' + v.slice(6);
  return v;
};

export const formatThaiDateNumeric = (dateStr: string | undefined): string => {
  if (!dateStr) return '';
  const [y, m, d] = dateStr.split('T')[0].split('-');
  const day = parseInt(d, 10);
  const month = parseInt(m, 10);
  const year = parseInt(y, 10) + 543;
  return `${day}/${month}/${year}`;
};

export const formatThaiDate = (dateStr: string | undefined): string => {
  if (!dateStr) return '';
  const datePart = dateStr.split('T')[0];
  const [y, m, d] = datePart.split('-');
  if (!y || !m || d === undefined) return dateStr;

  const months = [
    'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
    'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
  ];

  const day = parseInt(d, 10);
  const month = months[parseInt(m, 10) - 1];
  const year = parseInt(y, 10) + 543;

  return `${day} ${month} ${year}`;
};