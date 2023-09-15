
# Joshua Alzate Frontend Challenge

### Getting Started

Run `pnpm install` to install all the dependencies of the project, and run `pnpm dev` to serve the application, nothing special.


### What you should expect
Once you open your browser and navigated to `http://localhost:5173/`, you'll see a table with all the items from the CSV. Above of the table, you'll see a filter with all the available labels from the CSV.

If you click a row, there will be a modal with the image and red bounding box with respect to the coordinates provided from the CSV. If the image doesn't exist from the assets, there will be a text saying it does not exist.

Overall, that's it.

### Front end design

I made it simple as possible and responsive as I can with the help of Tailwind CSS. I didn't really spend much time to make it more appealing since I should only spend 3 hours to make this work. (It was also given on a weekday :D)

### File Structure and components
The assets are stored in the public folder, also the CSV file. Normal, I store all image related files on a CDN bucket so I don't have to worry hosting those file. And for the CSV, of course it should be pulled from a database. But I didn't overcomplicate it and store it on the public folder instead.

Usually on my approach, the App component has only the wrappers for the whole application and make it dynamic as possible. For this application, I don't really expect doing some complicated routing and data sharing. So I opted to put the main table and filter elements here. For the object visualer, I copied a broken library from Github and modified it a bit to make it work. So I created a separate component for that.

### Process
First, I fetch the CSV from the public folder and read all the data in it, and parse the it into an object to iterate it on the render method of App. I collect the labels for the filter options from there.

Normally, I do not populate all of the items then filter them out on the client side, I usually pass a filter and pagination values then let the backend handle the filtering of data and the job of the front end is to just show the records. And write some cache on the client side to improve and performance and make it fancy.

***


I believe I was able to deliver all the expected features. It was good front end exercise.
