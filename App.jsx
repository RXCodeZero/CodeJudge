import { useState } from 'react';

function App() {
    const [array, setArray] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const [searchValue, setSearchValue] = useState('');
    const [foundIndex, setFoundIndex] = useState(null);
    const [searchSteps, setSearchSteps] = useState([]); // Kept for consistency, but not rendered
    const [searchState, setSearchState] = useState({
        left: -1,
        right: -1,
        mid: -1,
        found: false,
        isSearching: false,
        notFound: false, // New state to handle the "not found" red boxes
    });

    const handleAdd = () => {
        const num = parseInt(inputValue);
        if (!isNaN(num)) {
            const newArray = [...array, num];
            newArray.sort((a, b) => a - b);
            setArray(newArray);
            setInputValue('');
            setFoundIndex(null);
            setSearchSteps([]);
            setSearchState({ left: -1, right: -1, mid: -1, found: false, isSearching: false, notFound: false });
        }
    };

    const handleSearch = () => {
        const tgt = parseInt(searchValue);
        if (isNaN(tgt) || array.length === 0) {
            setFoundIndex(null);
            setSearchState({ ...searchState, found: false, notFound: true, isSearching: false });
            return;
        }

        setFoundIndex(null);
        setSearchState({ ...searchState, isSearching: true, found: false, notFound: false });
        setSearchSteps([]);

        const visualizeStep = (currentL, currentR) => {
            if (currentL > currentR) {
                // When search is complete and not found
                setSearchState({ ...searchState, left: -1, right: -1, mid: -1, found: false, isSearching: false, notFound: true });
                return;
            }

            let mid = Math.floor((currentL + currentR) / 2);
            setSearchState({ left: currentL, right: currentR, mid, found: false, isSearching: true, notFound: false });

            setTimeout(() => {
                if (array[mid] === tgt) {
                    setFoundIndex(mid);
                    setSearchState({ ...searchState, left: -1, right: -1, mid: -1, found: true, isSearching: false, notFound: false });
                } else if (array[mid] < tgt) {
                    visualizeStep(mid + 1, currentR);
                } else {
                    visualizeStep(currentL, mid - 1);
                }
            }, 1000);
        };

        visualizeStep(0, array.length - 1);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 p-6 flex items-center justify-center">
            <div className="max-w-2xl w-full mx-auto bg-white shadow-2xl rounded-xl p-8 transform transition-all duration-300 hover:scale-[1.01] ">
                <h1 className="text-3xl font-extrabold mb-8 text-center text-indigo-800 drop-shadow-sm">
                    Binary Search Visualizer
                </h1>

                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                    <input
                        type="number"
                        value={inputValue}
                        placeholder="Enter number"
                        onChange={(e) => setInputValue(e.target.value)}
                        className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-4 focus:ring-indigo-300 transition-all duration-200"
                    />
                    <button
                        onClick={handleAdd}
                        className="bg-green-500 hover:bg-green-600 text-white font-semibold px-6 py-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-105"
                    >
                        Add
                    </button>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                    <input
                        type="number"
                        value={searchValue}
                        placeholder="Search number"
                        onChange={(e) => setSearchValue(e.target.value)}
                        className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-4 focus:ring-blue-300 transition-all duration-200"
                    />
                    <button
                        onClick={handleSearch}
                        className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-6 py-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-105"
                    >
                        Search
                    </button>
                </div>

                <div className="mb-6 p-4 border border-gray-200 rounded-lg bg-gray-50">
                    <strong className="text-gray-700 text-lg">Current Array:</strong>
                    <div className="mt-4 flex flex-wrap gap-2 justify-center transition-all duration-500">
                        {array.length > 0 ? (
                            array.map((num, i) => {
                                const inRange = i >= searchState.left && i <= searchState.right;
                                const isMid = i === searchState.mid;
                                const isFound = i === foundIndex;
                                const isFaded = searchState.isSearching && !inRange && !isMid;
                                const isNotFoundFinal = searchState.notFound;

                                return (
                                    <div
                                        key={i}
                                        className={`
                                            px-4 py-2 rounded-full text-sm font-medium shadow-sm transition-all duration-500
                                            ${isFound
                                                ? 'bg-green-500 text-white font-bold transform scale-110 animate-pulse'
                                                : isNotFoundFinal
                                                    ? 'bg-red-500 text-white' // All red when not found
                                                    : isFaded
                                                        ? 'bg-gray-200 text-gray-400 opacity-50'
                                                        : 'bg-indigo-200 text-indigo-800'
                                            }
                                        `}
                                    >
                                        {num}
                                    </div>
                                );
                            })
                        ) : (
                            <p className="text-gray-500 italic">Add numbers to the array to begin.</p>
                        )}
                    </div>
                </div>

                {foundIndex !== null && (
                    <div className="mt-4 p-4 rounded-lg font-semibold text-center bg-green-100 text-green-800 border border-green-300 animate-fade-in">
                        Found at index: {foundIndex}
                    </div>
                )}
                {searchState.notFound && (
                    <div className="mt-4 p-4 rounded-lg font-semibold text-center bg-red-100 text-red-800 border border-red-300 animate-fade-in">
                        Not Found.
                    </div>
                )}
            </div>
        </div>
    );
}

export default App;