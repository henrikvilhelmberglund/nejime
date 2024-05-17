---
title: "Examensarbete 30p: Nejime"
abstract: "Nejime är en app för att skapa musik i en webbläsare. Appen är en mycket simplifierad version av programmet LSDj på Gameboy."
author: "Henrik Berglund (FEND22)"
toc: true
number-sections: true
documentclass: bxjsarticle
classoption: xelatex,ja=standard
toc-title: "Innehållsförteckning"
include-in-header: 
  text:
    \renewcommand{\abstractname}{Abstrakt}
---

{{< pagebreak >}}

## Inledning

Denna uppsats handlar om mitt examensarbete där jag gjorde en webbapp kallad Nejime^[Japanska 音締め, att stämma ett instrument, speciellt shamisen. Direkt översatt "dra åt ljud".] som är till för att göra musik i en browser. Appen är en mycket simplifierad version av programmet LSDj på Gameboy som är en tracker^[En tracker är mjukvara för att skapa musik där användaren placerar ljud i rutnät. Varje rad representerar en tidsenhet och varje kolumn representerar en ljudkanal.].

## Bakgrund

Jag är intresserad av musik och tänkte att det kunde vara intressant att göra ett examensarbete som är relaterat till musik. Sedan tidigare kände jag till programmet LSDj på Gameboy och tänkte att jag kunde göra en webbsida med en mycket simplifierad version av det programmet.

Jag valde att skapa appen med Svelte 5 som är den senaste versionen av Javascriptramverket Svelte som kommer ha en officiell release troligt senare detta år. Svelte är känt för en simpel HTML och Javascript-liknande syntax och för att vara ett kompilerat ramverk vilket betyder att det ger väldigt bra prestanda. Jag har använt Svelte tidigare i skolarbete men fick använda React på LIA och de sista kurserna så jag ville testa Svelte igen och kände att det var en perfekt timing att testa Svelte 5 som tydligen ska göra vissa saker (t.ex state utanför komponenter) lättare.

## Syfte

Jag har flera syften med examensarbetet:

- Skapa ett projekt som senare kan bli ett större sidoprojekt. Jag förväntade mig inte att programmet skulle vara helt perfekt efter sex veckor utan att det skulle bli en grund som senare kan förbättras och utvecklas vidare. Speciellt genom opensource för jag kan tänka mig att andra kan bli intresserade av projektet när det har blivit mer komplett.

- Börja lära mig Svelte 5.

- Utmana mig själv genom att göra något som inte bara är en vanlig webbsida. Jag har aldrig gjort något liknande i komplexitet tidigare vilket betyder att det var svårt men också väldigt givande.

## Mål

Mitt främsta mål var att göra en app för att enkelt skapa musik i en webbläsare. Fokuset med denna första version var att det skulle vara smidigt och snabbt att använda och att enkelt göra musikskisser och testa olika idéer.

## Utvecklingsmiljö

Min utvecklingsmiljö var [Svelte 5](https://svelte-5-preview.vercel.app/docs/introduction) och appramverket [SvelteKit](https://kit.svelte.dev/) vilket använder [Vite](https://vitejs.dev/) som är känt för snabba uppdateringar efter kodändringar.

Jag använder VSCode som fungerar perfekt för mig för webbutveckling.

## Krav

Nejime var mitt eget projekt så jag kunde sätta egna krav. Jag hade bara två enkla krav, att man ska kunna göra musik som kan spelas upp och att appen ska kännas enkel och smidig att använda.

## Planering

Istället för att spendera mycket tid att skapa krav, user stories och tasks som jag kände var litet overkill när man är själv valde jag att ha en todofil med hjälp av en VSCode-extension [Todo+](https://marketplace.visualstudio.com/items?itemName=fabiospampinato.vscode-todo-plus) där jag kunde lägga till saker som behöver göras och markera när de är klara. Detta gjorde att jag kunde spendera mer tid att faktiskt koda som var något jag kände behövdes eftersom det för mig var ett svårt projekt.

En annan anledning var att jag inte visste hur långt jag skulle hinna och det kändes onödigt att teorisera för mycket om saker jag kanske inte hann göra ändå. Todofilen gjorde att jag enkelt kunde göra små fokuserade tasks som jag kunde göra, sedan markera när de var klara och lägga till nya todos för att utöka funktionaliteten.

## Teknisk beskrivning

### Indelning av komponenter: song, patterns, phrases

### Globalt state

### Hur man använder appen

#### Tangentbordskommandon

### Spara data

#### Komprimering av data (ta bort istället för --- etc)

## Utmaningar

Sjuk

Svårt att testa

## Framtid av appen

Lägga till funktioner som saknas, t.ex kommandon för arpeggion/volym

förbättra komprimering/datastruktur så man kan spara långa/komplicerade sånger

lägga till stöd för mobil

multiplayer?

## Avslutning och reflektion

Svårt men kul
