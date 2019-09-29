array = [-1,7,2,-5,8,-3,6,-4,-1,2,4];

function quick_sort_descended(arr){
    // append pivot
    arr.push(0);
    pivot = 0;
    low = 0;
    high = arr.length - 2; // 1 before pivot of 0
    while(low < high){
        while(arr[low] > pivot){
            low++;
        }
        while(arr[high] < pivot){
            high--;
        }
        console.log(arr[low],arr[high]);
        console.log(arr);

        swap = arr[low];
        arr[low] = arr[high];
        arr[high] = swap;
        low++;
        high--;
    }
    swap = arr[low];
    arr[low] = pivot;
    arr[arr.length - 1] = swap;
}

quick_sort_descended(array);
console.log(array);