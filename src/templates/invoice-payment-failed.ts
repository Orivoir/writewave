export function html() {
  return `
    <div style="font-family: Arial, sans-serif; color: #333;">
      <h1>Emails stripe event: invoice.payment.failed</h1>
    </div>
  `;
}

export function text(params: { userName: string }) {
  return `Emails stripe event: invoice.payment.failed`.trim();
}
