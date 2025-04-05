# Web Development Project 5 - *Open Book*

Submitted by: **Marko Tsymbaliuk**

This web app: **Open Book is a web application designed to help users discover and explore books through an intuitive, visually appealing interface. With features like category browsing, search functionality, and dynamic stats such as bestsellers and top authors, it offers a seamless and engaging experience. Inspired by the sleek design of Apple Music, Open Book provides smooth transitions and responsive design for an enjoyable browsing experience on both desktop and mobile devices.**

Time spent: **7** hours spent in total

## Video Walkthrough

Here's a walkthrough of the implemented features:

![Alt Text](docs/open-book-demo.gif)

## Required Features

The following **required** functionality is completed:

- [x] **The site has a dashboard displaying a list of data fetched using an API call**
  - The dashboard should display at least 10 unique items, one per row
  - The dashboard includes at least two features in each row
- [x] **`useEffect` React hook and `async`/`await` are used**
- [x] **The app dashboard includes at least three summary statistics about the data** 
  - The app dashboard includes at least three summary statistics about the data, such as:
    - *insert details here*
- [x] **A search bar allows the user to search for an item in the fetched data**
  - The search bar **correctly** filters items in the list, only displaying items matching the search query
  - The list of results dynamically updates as the user types into the search bar
- [x] **An additional filter allows the user to restrict displayed items by specified categories**
  - The filter restricts items in the list using a **different attribute** than the search bar 
  - The filter **correctly** filters items in the list, only displaying items matching the filter attribute in the dashboard
  - The dashboard list dynamically updates as the user adjusts the filter

The following **optional** features are implemented:

- [x] Filters use different input types
  - e.g., as a text input, a dropdown or radio selection, and/or a slider

### The following **additional** features are implemented:

- [x] **CSS Styling**: A custom, sleek design inspired by Apple Music, ensuring a modern and visually appealing interface.
- [x] **Stat Calculation**: Stats like bestsellers and top authors are computed only once at the start to optimize performance and prevent unnecessary recalculations.
- [x] **Animations**: Smooth transitions and animations were added to enhance the user experience and provide a more polished, dynamic feel.
- [x] **Deployment**: The app has been deployed using Vercel for seamless hosting and scalability.


## Notes

Challenges encountered while building the app:
- Styling Consistency: Achieving a polished design with smooth animations, while maintaining performance, required careful use of CSS transitions and animations.
- For this assignment, I needed to use the .filter() method to handle search functionality, which caused performance issues. Initially, my approach was to fetch data per page as needed, but to implement search, I had to fetch a large set of data and filter through it on the client side. This added overhead and slowed down the app. To address this, I optimized the performance by computing dynamic stats only once on initial load and improving the efficiency of the filtering process.

## License

    Copyright 2025 Marko Tsymbaliuk

    Licensed under the Apache License, Version 2.0 (the "License");
    you may not use this file except in compliance with the License.
    You may obtain a copy of the License at

        http://www.apache.org/licenses/LICENSE-2.0

    Unless required by applicable law or agreed to in writing, software
    distributed under the License is distributed on an "AS IS" BASIS,
    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    See the License for the specific language governing permissions and
    limitations under the License.
