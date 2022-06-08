import { Component, NgZone } from '@angular/core';
import { MatDialog } from '@angular/material';
import 'style-loader!./address-profile.scss';
import { ToastrService } from 'ngx-toastr';
import { AddressDialog } from '../address-dialog/address-dialog.component';
import { CommonErrorDialog } from '../../../../auth/model/common-error-dialog/common-error-dialog';

@Component({
    selector: 'address',
    templateUrl: 'address-profile.html',
    styleUrls: ['./address-profile.scss'],
})

export class AddressProfile {
    public latitude: any;
    public longitude: any;
    public address: string;
    public marker: google.maps.Marker;
    public enteredAddress: any;
    public addrsesInput: any;
    public placesObject: any = {};
    public city: any;
    public zip: any;
    public street: any;
    public state: any;
    public map: google.maps.Map;
    public currentLocation;
    public currentAddtress: any;
    currentLat;
    country;
    sublocality;
    locality;
    addressType;
    road;
    currentLong;
    public geocoder = new google.maps.Geocoder;
    public street_number: any;
    public route: any;
    public current: any;
    public zoom: number;
    public infowindow = new google.maps.InfoWindow({
        content: ''
    });

    constructor(private dialog: MatDialog, private toastrService: ToastrService, private zone: NgZone) {
        let el = $('#moveUp');
        $('html,body').animate({scrollTop: (el.offset().top - 50)}, 'slow', () => {
            el.focus();
        });
    }

    ngAfterViewInit() {
        if (document.getElementById('autocomplete')) {
            this.getAddress();
        }
        this.current = {lat: 39.2903848, lng: -76.612};
        this.map = new google.maps.Map(document.getElementById('map'), {
            center: {'lat': 39.2903848, 'lng': -76.612},
            zoom: 8,
        });
        this.marker = new google.maps.Marker();
    }

    getAddress() {
        let input: any = document.getElementById('autocomplete');
        let autocomplete = new google.maps.places.Autocomplete(input);
        autocomplete.addListener('place_changed', () => {
            let places = autocomplete.getPlace();
            let addressComponents = places.address_components;
            let latitude = places.geometry.location.lat();
            let longitude = places.geometry.location.lng();
            let route = '';
            let locality = '';
            let city = '';
            let state = '';
            let country = '';
            let postal = '';
            let street_number = '';
            let sublocality = '';
            let stateCode = '';
            for (let i = 0; i < addressComponents.length; i++) {
                let types = addressComponents[i].types;
                for (let j = 0; j < types.length; j++) {
                    if (types[j] == 'administrative_area_level_1') {
                        state = addressComponents[i].long_name;
                        stateCode = addressComponents[i].short_name;
                    }
                    if (types[j] == 'administrative_area_level_2') {
                        locality = addressComponents[i].long_name;
                    }
                    if (types[j] == 'neighborhood') {
                        city = addressComponents[i].long_name;
                    } else if (types[j] == 'locality') {
                        city = addressComponents[i].long_name;
                    } else if (types[j] == 'sublocality_level_1') {
                        city = addressComponents[i].long_name;
                    } else if (types[j] == 'sublocality_level_2') {
                        city = addressComponents[i].long_name;
                    } else if (types[j] == 'sublocality_level_3') {
                        city = addressComponents[i].long_name;
                    } else if (types[j] == 'sublocality_level_4') {
                        city = addressComponents[i].long_name;
                    } else if (types[j] == 'sublocality_level_5') {
                        city = addressComponents[i].long_name;
                    } else if (types[j] == 'administrative_area_level_3' && !city) {
                        city = addressComponents[i].long_name;
                    }

                    if (types[j] == 'sublocality_level_1') {
                        sublocality = addressComponents[i].long_name;
                    }
                    if (types[j] == 'country') {
                        country = addressComponents[i].long_name;
                    }
                    if (types[j] == 'postal_code') {
                        postal = addressComponents[i].long_name;
                    }
                    if (types[j] == 'route') {
                        route = addressComponents[i].long_name;
                    }
                    if (types[j] == 'street_number') {
                        street_number = addressComponents[i].long_name;
                    }
                }
                let area = {
                    street_number: street_number,
                    locality: city,
                    route: route,
                    administrative_area_level_1: state,
                    administrative_area_level_2: locality,
                    sublocality_level_1: sublocality,
                    postal_code: postal
                };

            }
            this.latitude = latitude;
            this.longitude = longitude;
            this.city = city;
            this.state = state;
            this.country = country;
            this.locality = city;
            this.zip = postal;
            this.street_number = street_number;
            this.sublocality = sublocality;
            this.route = route;
            if (postal) {
                this.addressType = 'ZIPCODE';
                this.zoom = 13;
            } else if (city) {
                this.addressType = 'CITY';
                this.zoom = 12;
            } else if (state) {
                this.addressType = 'STATE';
                this.zoom = 11;
            } else if (country) {
                this.addressType = 'COUNTRY';
                this.zoom = 6;
            }
            if (this.locality || this.route || this.address || this.street_number) {
                if (this.route == undefined) {
                    this.route = '';
                }
                if (this.address == undefined) {
                    this.address = '';

                }
                if (this.sublocality == undefined) {
                    this.sublocality = '';

                }
                if (this.street_number == undefined) {
                    this.street_number = '';
                }
                if (this.locality == undefined) {
                    this.locality = '';
                }

                this.street = this.street_number + ' ' + this.route;
                this.street = this.street.replace(/\s+/g, ' ').trim();
            } else {
                this.street = '';
            }
            let address = {
                city: this.locality,
                street: this.street,
                state: stateCode,
                locality: this.locality,
                country: country,
                zipCode: postal,
                latitude: latitude,
                longitude: longitude,
                currentLat: this.current.lat ? this.current.lat : this.currentLat,
                currentLong: this.current.lng ? this.current.lng : this.currentLong,
                sublocality: sublocality,
                route: route,
                stateCode: stateCode
            };

            this.enteredAddress = address;
            this.placesObject = autocomplete.getPlace();

            let LatLng = {lat: places.geometry.location.lat(), lng: places.geometry.location.lng()};
            this.marker.setMap(null);
            this.marker = new google.maps.Marker({
                position: LatLng,
                map: this.map,
            });

            this.marker.addListener('click', (event) => {
                this.infowindow = new google.maps.InfoWindow({
                    content: (this.enteredAddress.locality ? this.enteredAddress.locality : '' + this.enteredAddress.city ? this.enteredAddress.city : '' + this.enteredAddress.country ? this.enteredAddress.country : '')
                });
                this.infowindow.open(this.map, this.marker);
            });
            this.map.setCenter(new google.maps.LatLng(LatLng.lat, LatLng.lng));
        });
    }

    ngOnInit() {
        if ('geolocation' in navigator) {
            navigator.geolocation.getCurrentPosition((position) => {
                this.currentLat = position.coords.latitude;
                this.currentLong = position.coords.longitude;
                this.current = {lat: position.coords.latitude, lng: position.coords.longitude};

                this.map.setCenter(this.current);
                this.marker = new google.maps.Marker({
                    position: this.current,
                    map: this.map,
                    draggable: true
                });

                this.geocoder.geocode({'location': this.current}, (results, status) => {
                    if (results) {
                        if (results[0]) {
                            let address = results[0];
                            this.currentAddtress = results[0] ? results[0].formatted_address : '';
                            this.marker.addListener('click', (event) => {
                                this.infowindow = new google.maps.InfoWindow({
                                    content: this.currentAddtress
                                });
                                this.infowindow.open(this.map, this.marker);
                            });
                        }
                    }
                });
            });
        }
    }

    openDialog() {
        if (this.enteredAddress != undefined && this.addrsesInput != '' && this.addrsesInput != undefined && this.enteredAddress.street != '' && this.enteredAddress.city != '' && this.enteredAddress.zipCode != '' && this.enteredAddress.state != '' && this.street_number != '') {
            let dialogRef = this.dialog.open(AddressDialog, {
                data: {address: this.enteredAddress},
                panelClass: 'contentHieght'
            });
        } else {
            this.zone.run(() => {
                let dialogRef = this.dialog.open(CommonErrorDialog, {
                    data: {message: 'Please select a location with a valid street address.'}
                });
            });
            // this.toastrService.clear();
            // this.toastrService.error('Please Select Location');
        }
    }

}
