# Web Development Project 6 - Open Book

Submitted by: **Marko Tsymbaliuk**

This web app: **Open Book is a web application designed to help users discover and explore books through an intuitive, visually appealing interface. With features like category browsing, search functionality, and dynamic stats such as bestsellers and top authors, it offers a seamless and engaging experience. Inspired by the sleek design of Apple Music, Open Book provides smooth transitions and responsive design for an enjoyable browsing experience on both desktop and mobile devices.**

Time spent: **7** hours spent in total

## Video Walkthrough

Here's a walkthrough of implemented user stories:

![Video Walkthrough](<docs/Untitled%20design%20(10).gif>)

<!-- Replace this with whatever GIF tool you used! -->

GIF created with ...

<!-- Recommended tools:
[Kap](https://getkap.co/) for macOS
[ScreenToGif](https://www.screentogif.com/) for Windows
[peek](https://github.com/phw/peek) for Linux. -->

## Required Features

The following **required** functionality is completed:

- [x] **Clicking on an item in the list view displays more details about it**
  - Clicking on an item in the dashboard list navigates to a detail view for that item
  - Detail view includes extra information about the item not included in the dashboard view
  - The same sidebar is displayed in detail view as in dashboard view
  - _To ensure an accurate grade, your sidebar **must** be viewable when showing the details view in your recording._
- [x] **Each detail view of an item has a direct, unique URL link to that item's detail view page**
  - _To ensure an accurate grade, the URL/address bar of your web browser **must** be viewable in your recording._
- [x] **The app includes at least two unique charts developed using the fetched data that tell an interesting story**
  - At least two charts should be incorporated into the dashboard view of the site
  - Each chart should describe a different aspect of the dataset

The following **optional** features are implemented:

- [x] The site's customized dashboard contains more content that explains what is interesting about the data
  - e.g., an additional description, graph annotation, suggestion for which filters to use, or an additional page that explains more about the data
- [ ] The site allows users to toggle between different data visualizations
  - User should be able to use some mechanism to toggle between displaying and hiding visualizations

The following **additional** features are implemented:

- [x] **CSS Styling**: A custom, sleek design inspired by Apple Music, ensuring a modern and visually appealing interface.
- [x] **Stat Calculation**: Stats like bestsellers and top authors are computed only once at the start to optimize performance and prevent unnecessary recalculations.
- [x] **Animations**: Smooth transitions and animations were added to enhance the user experience and provide a more polished, dynamic feel.
- [x] **Deployment**: The app has been deployed using Vercel for seamless hosting and scalability.
- [ ] List anything else that you added to improve the site's functionality!

## Notes

Challenges encountered while building the app:

- Styling Consistency: Achieving a polished design with smooth animations, while maintaining performance, required careful use of CSS transitions and animations.
- For this assignment, I needed to use the .filter() method to handle search functionality, which caused performance issues. Initially, my approach was to fetch data per page as needed, but to implement search, I had to fetch a large set of data and filter through it on the client side. This added overhead and slowed down the app. To address this, I optimized the performance by computing dynamic stats only once on initial load and improving the efficiency of the filtering process.

## License

    Copyright 2024 Marko Tsymbaliuk

    Licensed under the Apache License, Version 2.0 (the "License");
    you may not use this file except in compliance with the License.
    You may obtain a copy of the License at

        http://www.apache.org/licenses/LICENSE-2.0

    Unless required by applicable law or agreed to in writing, software
    distributed under the License is distributed on an "AS IS" BASIS,
    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    See the License for the specific language governing permissions and
    limitations under the License.
