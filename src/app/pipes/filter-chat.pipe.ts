import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterChat'
})
export class FilterChatPipe implements PipeTransform {

  transform(items: any[], searchText: string, fieldName: string): any {
    console.log(searchText);
    // return empty array if array is falsy
    if (!items) { return []; }
    
    // return the original array if search text is empty
    if (!searchText) { return items; }
    
    // convert the searchText to lower case
    searchText = searchText.toLowerCase();
    
    // retrun the filtered array
    return items.filter(item => {
      if (item && item[fieldName]) {
        return item[fieldName].toLowerCase().includes(searchText);
      }
      return false;
    });
}

}
