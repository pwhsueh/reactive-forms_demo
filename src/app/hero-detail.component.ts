import { Component, Input, OnChanges }             from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Address, Hero, states } from './data-model';


@Component({
  selector: 'hero-detail',
  templateUrl: './hero-detail.component.html'
})
export class HeroDetailComponent {
  @Input() hero: Hero;

  heroForm: FormGroup;
  states = states;

  constructor(private fb: FormBuilder) {
    this.createForm();
  }

  ngOnChanges() {
    // this.heroForm.setValue({
    //   name:    this.hero.name,
    //   address: this.hero.addresses[0] || new Address()
    // });

    // this.heroForm.patchValue({
    //   name:    this.hero.name,
    //   address: this.hero.addresses[0] || new Address()
    // });

    this.heroForm.reset({
      name: this.hero.name,
      address: this.hero.addresses[0] || new Address()
    });
  }

  createForm() {
    this.heroForm = this.fb.group({
      name: ['', Validators.required ],
      address: this.fb.group(new Address()), // <-- a FormGroup with a new address
      power: '',
      sidekick: ''
    });
  }
}
