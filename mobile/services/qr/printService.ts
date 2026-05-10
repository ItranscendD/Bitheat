import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { ChildRecord, Guardian } from '@bitheat/shared';

/**
 * Generates HTML for a credit-card sized health passport (85x54mm)
 */
export const generatePrintHTML = (
  child: ChildRecord,
  qrDataURL: string,
  guardian?: Guardian,
  chwName?: string,
  facilityName?: string
): string => {
  return `
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no" />
        <style>
          @page { size: 85mm 54mm; margin: 0; }
          body { 
            font-family: 'Helvetica', sans-serif; 
            margin: 0; 
            padding: 0; 
            background: #0D1117; 
            color: #E6EDF3;
            width: 85mm;
            height: 54mm;
            display: flex;
            overflow: hidden;
          }
          .card {
            width: 100%;
            height: 100%;
            padding: 4mm;
            box-sizing: border-box;
            display: flex;
            flex-direction: row;
            border: 1px solid #30363D;
          }
          .qr-section {
            width: 40mm;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
          }
          .qr-image {
            width: 35mm;
            height: 35mm;
            background: white;
            padding: 2mm;
            border-radius: 2mm;
          }
          .info-section {
            flex: 1;
            padding-left: 4mm;
            display: flex;
            flex-direction: column;
            justify-content: center;
          }
          .brand {
            font-size: 10pt;
            font-weight: bold;
            color: #0CCE8B;
            margin-bottom: 2mm;
          }
          .name {
            font-size: 14pt;
            font-weight: 800;
            margin-bottom: 1mm;
          }
          .dob {
            font-size: 10pt;
            color: #8B949E;
            margin-bottom: 3mm;
          }
          .did-short {
            font-family: 'Courier', monospace;
            font-size: 7pt;
            color: #484F58;
          }
          .footer-note {
            position: absolute;
            bottom: 4mm;
            right: 4mm;
            font-size: 6pt;
            color: #30363D;
          }
        </style>
      </head>
      <body>
        <div class="card">
          <div class="qr-section">
            <img src="${qrDataURL}" class="qr-image" />
          </div>
          <div class="info-section">
            <div class="brand">BITHEAT HEALTH PASSPORT</div>
            <div class="name">${child.name}</div>
            <div class="dob">BORN: ${child.dob} • ${child.sex}</div>
            <div class="did-short">${child.did.slice(0, 24)}...</div>
            ${facilityName ? `<div style="font-size: 8pt; margin-top: 2mm; color: #0CCE8B">${facilityName}</div>` : ''}
          </div>
          <div class="footer-note">BLOCKCHAIN ANCHORED IDENTITY</div>
        </div>
      </body>
    </html>
  `;
};

/**
 * Opens print dialog for the health card
 */
export const printCard = async (html: string) => {
  await Print.printAsync({ html });
};

/**
 * Shares the QR image file
 */
export const shareQRImage = async (uri: string, fileName: string) => {
  if (!(await Sharing.isAvailableAsync())) {
    alert('Sharing is not available on this device');
    return;
  }
  await Sharing.shareAsync(uri, { dialogTitle: fileName });
};
