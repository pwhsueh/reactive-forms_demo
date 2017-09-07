import { Component, Input, OnChanges }             from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators ,ValidatorFn , AbstractControl } from '@angular/forms';
import { Address, Hero, states } from './data-model';
import { HeroService } from './hero.service';


@Component({
  selector: 'hero-detail',
  templateUrl: './hero-detail.component.html'
})
export class HeroDetailComponent implements OnChanges {
  @Input() hero: Hero;

  heroForm: FormGroup;
  states = states;

  constructor(private fb: FormBuilder, private heroService: HeroService) {
    this.createForm();
    this.logNameChange();
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
      // address: this.hero.addresses[0] || new Address()
    });
    this.setAddresses(this.hero.addresses);
  }

  createForm() {
    this.heroForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(4), forbiddenBowenValidator ,forbiddenNameValidator(/bob/i)] ],
      secretLairs: this.fb.array([]), // <-- a FormGroup with a new address
      power: '',
      sidekick: ''
    });
  }

  setAddresses(addresses: Address[]) {
    const addressFGs = addresses.map(address => this.fb.group(address));
    //[FormGroup1,ForGroup2,.....]
    const addressFormArray = this.fb.array(addressFGs);

    this.heroForm.setControl('secretLairs', addressFormArray);
  }

  get mySecretLairs(): FormArray {
    return this.heroForm.get('secretLairs') as FormArray;
  };

  addLair() {
    this.mySecretLairs.push(this.fb.group(new Address()));
  }

  removeLair(index: number) {
    this.mySecretLairs.removeAt(index);
  }

  nameChangeLog: string[] = [];

  logNameChange() {
    const nameControl = this.heroForm.get('name');

    nameControl.valueChanges.forEach(
      (value: string) => this.nameChangeLog.push(value)
    );
  }

  onSubmit() {
    this.hero = this.prepareSaveHero();
    this.heroService.updateHero(this.hero).subscribe(/* error handling */);
    this.ngOnChanges();
  }

  prepareSaveHero(): Hero {
    const formModel = this.heroForm.value;

    // deep copy of form model lairs
    const secretLairsDeepCopy: Address[] = formModel.secretLairs.map(
      (address: Address) => Object.assign({}, address)
    );

    // return new `Hero` object containing a combination of original hero value(s)
    // and deep copies of changed form model values
    const saveHero: Hero = {
      id: this.hero.id,
      name: formModel.name as string,
      // addresses: formModel.secretLairs // <-- bad!
      addresses: secretLairsDeepCopy
    };
    return saveHero;
  }

  revert() { this.ngOnChanges(); }

  get name() { return this.heroForm.get('name'); }

  get power() { return this.heroForm.get('power'); }
}

/** A hero's name can't match the given regular expression */
export function forbiddenNameValidator(nameRe: RegExp): ValidatorFn {
  return (control: AbstractControl): {[key: string]: any} => {
    const forbidden = nameRe.test(control.value);
    return forbidden ? {'forbiddenName': {value: control.value}} : null;
  };
}

export function forbiddenBowenValidator(control: AbstractControl): {[key: string]: any} {
  const forbidden = RegExp(/Bowen/i).test(control.value);
  return forbidden ? {'forbiddenName': {value: control.value}} : null;
}
