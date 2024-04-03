## Solid Mars mini-hackathon

### About The Project

This project, developed for the 2024 Solid Mini Hackathon, aim to be a clone of [Instructables.com](https://Instructables.com) utilizing [Social Linked Data](https://solidproject.org). It aims to demonstrate the potential of decentralized web technologies by allowing users, fablabs, or hackerspaces to host their own Instructables-like websites.

### Inspiration

The initial motivation is to empower communities to manage and share their DIY guides, recipes, or tutorials while maintaining interoperability and connectivity between different instances. Leveraging linked data, the platform could offers enhanced search and browsing capabilities, like querying based on available supplies (e.g., finding projects that recycle plastic bottles).

### Used technologies

The project is constructed using [LDO](https://ldo.js.org) and [shacl-form](https://github.com/ULB-Darmstadt/shacl-form). Shacl-form provides the capability to dynamically generate forms from SHACL shapes, streamlining the process of creating and editing content, as demonstrated on the /create page. A notable aspect of this project is its flexibility; adapting it to different types of data, such as recipes, is straightforward. To transition to a recipe website, simply place a recipe shape file in the .shape folder and develop a new view utilizing LDO to handle the recipe data.

## usage

Login to your pod, create a tutorial, and view your tutorials !
Your can delete a tutorial at the bottom of the tutorial's page.

## install

```
npm i
npm run build:ldo
cd shacl-from
npm i
npm build
```


## run

```
npm run start
```

## live demo

https://semantic-tutorials.netlify.app
