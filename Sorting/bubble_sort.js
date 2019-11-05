array = [1,3,6,4,7,2,5,0,8,1,2,4];

function bubble_sort(array){
    for(i = 0; i < array.length; i++){
        for(j = 0; j < array.length - i - 1; j++){
            if(array[j] > array[j + 1]){
                swap = array[j];
                array[j] = array[j + 1];
                array[j + 1] = swap;
            }
        }
    }
}
bubble_sort(array);
console.log(array);