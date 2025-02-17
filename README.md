# React Video Gallery for Jahia 8.2

## 📌 Overview
This module provides a **React-based video gallery** for **Jahia 8.2**. It supports both **internal** and **external videos** (YouTube, Vimeo, Wistia, and Storylane) and integrates with **Jahia’s GraphQL API**.

## 🚀 Features
- 📺 **Displays internal and external videos** inside a gallery.
- 🖼️ **Supports video posters (thumbnails)** for each video.
- 🔗 **Fetches video data via GraphQL**.
- 🛠️ **Edit mode support**: Enables content editing in Jahia’s Content Editor.
- 🖥️ **React-based frontend** for a modern user experience.

---
## Screenshots
![picture](./src/main/resources/img/reactVideoGallery.png)
---

## 📦 Installation

### **1️⃣ Prerequisites**
Ensure you have the following installed:
- **Jahia 8.2+**
- **Node.js 16+**
- **Yarn or npm**
- **Jahia GraphQL API enabled**

### **2️⃣ Clone the Repository**
```sh
git clone https://github.com/smonier/react-video-gallery-jahia.git
cd react-video-gallery-jahia
```

### **3️⃣ Install Dependencies**

```sh
yarn install
```
or
```sh
npm install
```

### **4️⃣ Build the Module**
```sh
mvn clean install
```

### **5️⃣ Deploy to Jahia**
- Upload the generated JAR file to Jahia Module Manager.
- Start the module and enable it on your site.

---

## ⚙️ Configuration

### JCR Definitions (definitions.cnd)

The module defines three content types:
```sh
[rvgmix:mediagalleries] > jmix:droppableContent, jmix:visibleInContentTree, jmix:editorialContent mixin

[rvgnt:internalVideo] > jnt:content, mix:title
- video (weakreference, picker[type='file'])
- videoPoster (weakreference, picker[type='image']) < 'jmix:image'

[rvgnt:externalVideo] > jnt:content, mix:title
- videoService (string)
- videoId (string)
- videoPoster (weakreference, picker[type='image']) < 'jmix:image'

[rvgnt:videoGallery] > jnt:content, mix:title, rvgmix:mediagalleries, jmix:list
- bannerText (string, richtext) internationalized
- itemWidth (long) = 250 indexed=no mandatory
+ * (rvgnt:internalVideo)
+ * (rvgnt:externalVideo)
```

### 🔗 GraphQL Queries

GraphQL Query (reactVideoGallery.gql-queries.js)

This query fetches the video gallery data:
```sh
import { gql } from '@apollo/client';

export const GET_REACT_VIDEO_GALLERY = gql`
    query getReactVideoGalleryData($workspace: Workspace!, $id: String!, $language: String!) {
        response: jcr(workspace: $workspace) {
            Gallery: nodeById(uuid: $id) {
                title: displayName(language: $language)
                bannerText: property(name: "bannerText", language: $language) { value }
                itemWidth: property(name: "itemWidth") { value }
                children {
                    nodes {
                        primaryNodeType { name }
                        ...InternalVideoFields
                        ...ExternalVideoFields
                    }
                }
            }
        }
    }
`;
```

## 🏗️ How It Works

### 1️⃣ Video Display (ReactVideoGallery.jsx)
- Fetches data from GraphQL
- Renders internal & external videos
- Supports editing & preview mode

### 2️⃣ Editing Mode
- When isEditing === true, an edit button appears next to the title.
- Clicking the button opens Jahia’s Content Editor via:
```sh
parent.top.window.CE_API.edit({ uuid: video.id });
```

### 3️⃣ Handling Content Updates
- The page refreshes when editing is closed:
```sh
parent.top.window.CE_API.edit(
            {uuid: video.uuid},
            () => {}, // No need for a first callback
            () => {
                console.log('Content editor closed, reloading page...');
                window.location.reload();
            }
        );
```

## License

This project is **MIT Licensed**. See [`LICENSE`](LICENSE) for details.
