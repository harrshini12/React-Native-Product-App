## Product Item Component Readme

# Overview

This repository contains a React Native component called ProductItem.tsx, which is designed to display individual product items on a home screen. The component has been developed to meet specific requirements related to the design of the product list.

# Features

The ProductItem component includes the following features:

1. Display Product Information* 
    * Product Name (as shown in the new design)
    * Product Date
    * If the date is within the last 7 days, it displays a "New" icon
    * Product Image
    * If the image is missing, it displays a placeholder
    * Product Categories displayed as individual "Tags" 

2. Expand and Collapse
    * Supports the collapsing and expanding of the item as displayed in the design prototype.

3. Dynamic Data
    * The component retrieves all product data from the inventory state, ensuring that it reflects the latest information.

## Technologies Used

* React Native: A JavaScript framework for building native mobile apps.
* Expo: A platform for developing and deploying React Native applications.
* Material Community Icons: A library of icons for use in React Native applications.
* Expo Font: A library for using custom fonts

### Installation

1. Navigate to the project directory:
    * cd react-native

2. Install the dependencies:
    * npm install

3. Running the Application
    * npm start