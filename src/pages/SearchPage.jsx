// import { useState } from "react";
// import SearchItem from "../components/SearchItem";
// import ResultPage from "../components/ResultPage";
// import classes from "./SearchPage.module.scss"
// import { useEffect } from "react";
// const Search = () => {
//   const [results, setResults] = useState([]);
//   // const [totalPages, setTotalPages] = useState(0);
//   const [pagination, setPagination] = useState([0]); // offset
//   const [activeOffset, setActiveOffset] = useState(-1);
//   // const inputRef = useRef(null);
//   const [query, setQuery] = useState("")

//   useEffect(() => {
//     const typingTimer = setTimeout(() => {
//       if (query.length >= 3) {
//         setActiveOffset(-1);
//         // setQuery()
//         searchInit(query);
//       } else {
//         setResults([])
//       }
//     }, 500);
//     return () => clearTimeout(typingTimer);

//   }, [query])//inputRef.current?.value

//   useEffect(() => {
//     if (activeOffset !== -1) {
//       setPagination((prevPagination) =>
//         prevPagination.map((offset, pageNumber) => {
//           if (activeOffset / 10 <= pageNumber && activeOffset / 10 + 5 > pageNumber) {
//             return { ...offset, shown: true }
//           }
//           return { ...offset, shown: false }
//         }))
//     }
//   }, [activeOffset, query]);

//   const searchInit = async (value, offset = 0) => {
//     const searchOutput = await fetch(`http://localhost:3000/searchAlbums?q=${value}&offset=${offset}&limit=10`, {
//       method: 'GET',
//       headers: { 'Content-Type': 'application/json' },
//     });
//     const { total, ...output } = await searchOutput.json();
//     setResults(() => {
//       return output.foundAlbums
//     });
//     setActiveOffset(offset);

//     // setTotalPages(Math.ceil(total/10));
//     setPagination(() => {
//       let pages = [];
//       const totalPages = Math.ceil(total / 10);
//       for (let page = 0; page < totalPages; page++) {
//         const newOffset = page * 10;
//         let active = false;

//         if (newOffset === offset) {
//           active = true;
//         }
//         pages.push({ pageOffset: newOffset, active });
//       }
//       return pages;
//     })
//   }

//   const inputHandler = (e) => {
//     setQuery(e.target.value)
//     // if (inputRef.current.value.length >= 3) {
//     //   setActiveOffset(() => -1);
//     //   searchInit(e.target.value);
//     // } else {
//     //   setResults([])
//     // }
//   }

//   const changePageHandler = (offset) => {
//     searchInit(query, offset)
//   }

//   const nextHandler = () => {
//     if (pagination.length > activeOffset / 10 + 1) {
//       searchInit(query, activeOffset + 10);
//     }
//   }

//   const previousHandler = () => {
//     if (activeOffset / 10 - 1 >= 0) {
//       searchInit(query, activeOffset - 10);
//     }
//   }

//   const resultsFound = () => {
//       return (
//       <>
//       SearchPAGE
//         <button className="" onClick={previousHandler}>&larr;</button>
//         <div className={classes.pagination}>
//           {pagination.map((page, index) => {
//             return <ResultPage
//               key={index}
//               pageNumber={index}
//               page={page}
//               clickHandler={() => changePageHandler(page.pageOffset)} />
//           })}
//         </div>
//         <button className="" onClick={nextHandler}>&rarr;</button>
//       </>
//       )
//   }

//   const resultsNotFound = () => {
//       return <h3>No results found for &quot;{query}&quot; Please check your search again. </h3>
//   }

//   return (
//     <>
//       <div className="classes.searchBox">
//         <input type="text" value={query} onChange={event => inputHandler(event)} />
//         {/* ref={inputRef} */}
//       </div>
//       <div className="classes.searchResults">
//         {results.map((item, index) =>
//           <SearchItem key={index} name={item.name} albumID={item.albumID} artists={item.artists} image={item.image.url} type="album" />)}
//       </div>
//       {results.length > 0 && resultsFound()}
//       {results.length === 0 && query.length > 5 && activeOffset !== -1 && resultsNotFound()}
//     </>
//   )
// }

// export default Search;