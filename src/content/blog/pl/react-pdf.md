---
title: React-PDF z Next.js
lang: pl
key: react-pdf-with-next-js
description: Jak generować, wyświetlać i pobierać dynamiczne pliki PDF w aplikacji Next.js z użyciem React-PDF.
slug: react-pdf-with-next-js
metaDescription: ''
tags:
  - Next.js
  - React-PDF
  - React.js
---

# React-PDF z Next.js

Kilka miesięcy temu dostałem w pracy zadanie stworzenia pliku PDF w projekcie opartym o Reacta i Next.js. Dokument miał być generowany dynamicznie po zakupie i zawierać unikalny numer pobrany z backendu jako potwierdzenie transakcji. Zadanie wydawało się proste: po krótkim researchu wybrałem `@react-pdf/renderer`. Potem pojawiły się pierwsze problemy. Jeśli trafisz na podobne, ten wpis powinien pomóc przejść przez konfigurację.

## Instalacja

Zainstaluj paczkę:

```bash
npm install @react-pdf/renderer
```

Jeśli `npm` zgłasza w projekcie konflikty zależności peer dependencies, zainstaluj ją z flagą `--legacy-peer-deps`:

```bash
npm install @react-pdf/renderer --save --legacy-peer-deps
```

Podstawowe elementy, z których budujemy dokument PDF, to `Document`, `Page`, `View`, `Text` i `Image`. Możesz też zaimportować pomocnicze elementy, takie jak `PDFViewer`, `PDFDownloadLink`, `StyleSheet` i `Font`:

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

To są główne klocki, z których składasz PDF. `View` działa podobnie do `diva`, ale pamiętaj, że React-PDF nie renderuje zwykłych elementów HTML wewnątrz dokumentu.

Fonty, których chcesz używać w PDF-ie, trzeba najpierw zarejestrować:

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

## Struktura dokumentu

Struktura dokumentu może wyglądać tak:

```tsx
const PDF = () => {
  return (
    <Document>
      <Page>
        <View>
          <Text>Treść dokumentu</Text>
        </View>
      </Page>
    </Document>
  );
};
```

Jak wspomniałem wcześniej, `View` jest odpowiednikiem kontenera. Możesz tworzyć tyle elementów `View`, ile potrzebujesz, i zagnieżdżać je w zależności od układu dokumentu.

## Style

Elementy możesz stylować inline:

```tsx
<View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
  <Text>Treść</Text>
</View>
```

Warto jawnie ustawiać `flexDirection`. W CSS-ie przeglądarkowym domyślną wartością `flex-direction` jest `row`, ale layout React-PDF zachowuje się inaczej, więc konkretne wartości dają bardziej przewidywalny efekt.

Druga, czytelniejsza opcja to `StyleSheet.create`:

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

## PDF na stronie

Żeby wyświetlić PDF na stronie, z pliku, w którym tworzysz dokument, wyeksportuj komponent z `PDFViewer`:

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

Następnie zaimportuj ten komponent dynamicznie na stronie, na której PDF ma być widoczny:

```tsx
'use client';

import dynamic from 'next/dynamic';

const InvoicePDF = dynamic(() => import('./pdf'), {
  ssr: false,
});
```

Opcja `ssr: false` jest w Next.js ważna. React-PDF potrzebuje API dostępnych w przeglądarce, więc viewer powinien renderować się po stronie klienta.

Później używasz `InvoicePDF` jak każdego innego komponentu Reactowego:

```tsx
export default function PDFPage() {
  return (
    <div className={styles.pdfWrapper}>
      <InvoicePDF locale={locale} />
    </div>
  );
}
```

## Przycisk pobierania PDF-a

Jeśli zamiast podglądu PDF-a albo obok niego chcesz dodać przycisk pobierania, `PDFDownloadLink` również zaimportuj dynamicznie:

```tsx
const PDFDownloadLink = dynamic(
  () => import('@react-pdf/renderer').then((mod) => mod.PDFDownloadLink),
  { ssr: false }
);
```

Następnie owiń swój przycisk komponentem `PDFDownloadLink`:

```tsx
<PDFDownloadLink
  document={<PDF locale={locale} />}
  fileName={`DominikFrackowiak_CV_${locale}.pdf`}
>
  <button className={className}>{handleTranslation(locale)}</button>
</PDFDownloadLink>
```

I gotowe.
