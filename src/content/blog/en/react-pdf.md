---
title: React-PDF with Next.js
lang: en
key: react-pdf-with-next-js
description: How to generate, preview, and download dynamic PDF files in a Next.js app with React-PDF.
slug: react-pdf-with-next-js
tags:
  - Next.js
  - React-PDF
  - React.js
---

# React-PDF with Next.js

A few months ago, I was asked at work to create a PDF in a React and Next.js project. The file had to be generated dynamically after purchase and include a unique number from the backend as proof of purchase. The task seemed simple: after a short research session, I chose `@react-pdf/renderer`. Then the first problems appeared. If you run into similar ones, this post should help you get through the setup.

## Installation

Install the package:

```bash
npm install @react-pdf/renderer
```

If `npm` reports peer dependency conflicts in your project, install it with `--legacy-peer-deps`:

```bash
npm install @react-pdf/renderer --save --legacy-peer-deps
```

The basic elements used to build a PDF document are `Document`, `Page`, `View`, `Text`, and `Image`. You can also import helpers such as `PDFViewer`, `PDFDownloadLink`, `StyleSheet`, and `Font`:

```tsx
import {
  Document,
  Page,
  View,
  Text,
  Image,
  PDFViewer,
  StyleSheet,
  Font,
} from '@react-pdf/renderer';
```

These are the building blocks of the PDF. `View` works similarly to a `div`, but remember that React-PDF does not render regular HTML elements inside the document.

Fonts you want to use in the PDF must be registered first:

```tsx
Font.register({
  family: 'Roboto',
  fonts: [
    { src: '/assets/fonts/Roboto-Regular.ttf', fontWeight: 400 },
    { src: '/assets/fonts/Roboto-Medium.ttf', fontWeight: 500 },
    { src: '/assets/fonts/Roboto-Bold.ttf', fontWeight: 700 },
  ],
});
```

## Document Structure

The document structure can look like this:

```tsx
const PDF = () => {
  return (
    <Document>
      <Page>
        <View>
          <Text>Your content here</Text>
        </View>
      </Page>
    </Document>
  );
};
```

As mentioned earlier, `View` is the equivalent of a container. You can create as many `View` elements as you need and nest them depending on your layout.

## Styling

You can style elements inline:

```tsx
<View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
  <Text>Content</Text>
</View>
```

It is worth setting `flexDirection` explicitly. In browser CSS, `row` is the default for `flex-direction`, but React-PDF layout behaves differently and explicit values make the result more predictable.

The second, cleaner option is `StyleSheet.create`:

```tsx
const styles = StyleSheet.create({
  imageWrapper: {
    marginLeft: 20,
  },
});

<View style={styles.imageWrapper}>
  <Image src="/assets/example.png" />
</View>;
```

## PDF on the Page

To display the PDF on a page, export a component with `PDFViewer` from the file where you create the PDF:

```tsx
const PDFView = () => {
  return (
    <PDFViewer>
      <PDF />
    </PDFViewer>
  );
};

export default PDFView;
```

Then import that component dynamically on the page where the PDF should be displayed:

```tsx
'use client';

import dynamic from 'next/dynamic';

const InvoicePDF = dynamic(() => import('./pdf'), {
  ssr: false,
});
```

The `ssr: false` option is important in Next.js. React-PDF needs browser APIs, so the viewer should be rendered on the client side.

You can then use `InvoicePDF` like any other React component:

```tsx
export default function PDFPage() {
  return (
    <div className={styles.pdfWrapper}>
      <InvoicePDF locale={locale} />
    </div>
  );
}
```

## Download Button for the PDF

If you want to add a download button instead of, or next to, the PDF preview, import `PDFDownloadLink` dynamically as well:

```tsx
const PDFDownloadLink = dynamic(
  () => import('@react-pdf/renderer').then((mod) => mod.PDFDownloadLink),
  { ssr: false }
);
```

Then wrap your button with `PDFDownloadLink`:

```tsx
<PDFDownloadLink
  document={<PDF locale={locale} />}
  fileName={`DominikFrackowiak_CV_${locale}.pdf`}
>
  <button className={className}>{handleTranslation(locale)}</button>
</PDFDownloadLink>
```

And that's it.
