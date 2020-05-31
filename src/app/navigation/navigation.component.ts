import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { distinctUntilKeyChanged, debounceTime } from 'rxjs/operators';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { BestMatch } from '../_interfaces/search';
import { SymbolSearchService } from '../_services/symbol-search.service';

@Component({
  selector: 'kms-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent implements OnInit, OnDestroy {

  searchForm: FormGroup;
  autocompleteOptions: BestMatch[];
  selectedOptionValue: string;
  @ViewChild('searchInput') searchInputRef: ElementRef;
  searchTerm$: Subscription;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private symbolSearch: SymbolSearchService
  ) { }

  ngOnInit(): void {
    this.searchForm = this.fb.group({
      searchTerm: this.fb.control('')
    });

    this.searchTerm$ = this.searchForm.valueChanges.pipe(
      distinctUntilKeyChanged('searchTerm'),
      debounceTime(300),
    ).subscribe(async formValue => {
      if (formValue.searchTerm === '') {
        this.resetAutocompeteOptions();
      } else {
        if (formValue.searchTerm !== this.selectedOptionValue && formValue.searchTerm.length > 0) {
          this.loading = true;
          this.autocompleteOptions = await this.symbolSearch.searchSymbols(formValue.searchTerm);
          this.loading = false;
        }
      }
    });
  }

  resetAutocompeteOptions() {
    this.autocompleteOptions = [];
  }

  onOptionSelected(event: MatAutocompleteSelectedEvent) {
    this.selectedOptionValue = event.option.value;
  }

  resetSearch() {
    this.searchForm.controls.searchTerm.setValue('');
    this.searchInputRef.nativeElement.blur();
  }

  onSubmit() {
    const symbolParam = this.searchForm.value.searchTerm;
    this.resetSearch();
    if (symbolParam.length > 0) {
      this.router.navigate(['daily', symbolParam]);
    }
  }

  ngOnDestroy() {
    this.searchTerm$.unsubscribe();
  }

}
