import { Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { ProdutoService } from './../../shared/services/produto.service';
import { ImagemService } from 'src/app/shared/services/imagem.service';
import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { GoogleMap } from '@angular/google-maps';
import { Produto } from 'src/app/model/Produto.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('GoogleMap', { static: false }) map?: GoogleMap;

  randProd?: Produto[];

  intervalo:any = null

  zoom = 18;

  center: google.maps.LatLngLiteral = {
    lat: -8.1188099,
    lng: -34.9553379,
  };

  options: google.maps.MapOptions = {
    mapTypeId: 'roadmap',
    zoomControl: false,
    scrollwheel: false,
    disableDoubleClickZoom: true,
    maxZoom: 33,
    minZoom: 8,
  };

  constructor(
    private imgServ: ImagemService,
    private prodServ: ProdutoService,
    private sanitizer: DomSanitizer,
    private router: Router
  ) {}
  ngOnDestroy(): void {
    if(this.intervalo){
      clearInterval(this.intervalo);
    }
  }

  ngAfterViewInit(): void {
    let sideLeft = document.querySelector('.side-left');
    let a = sideLeft?.querySelector('a');
    let img = sideLeft?.querySelector('img');

    img?.style.setProperty(
      'top',
      '' + (a?.offsetTop! + a?.offsetHeight!) + 'px'
    );

    document.querySelector('card-product')?.classList.add('card-current');

    this.intervalo = setInterval(() => {
      this.moverSlider(1);
    }, 5000);
  }

  ngOnInit(): void {
    this.prodServ.getAllProduct().subscribe({
      next: (prods) => {
        this.randProd = []
        prods.forEach((prod, index) => {
          if (index < 6) {

            prod.photoUrl?.forEach(photo => {
              this.imgServ.downloadImagem(photo).subscribe({
                next: (blob) => {
                  prod.photoObject?.push(this.sanitizer.bypassSecurityTrustUrl(
                    URL.createObjectURL(blob)
                  ));
                },
              });
            });
            this.randProd!.push(prod);
          }
        });
      },
    });
  }

  zoomIn() {
    if (this.options.maxZoom) {
      if (this.zoom < this.options.maxZoom) this.zoom++;
    }
  }

  zoomOut() {
    if (this.options.minZoom) {
      if (this.zoom > this.options.minZoom) this.zoom--;
    }
  }

  setViewPanoramica() {
    let streetView = this.map?.getStreetView();
    const panoramaOptions: google.maps.StreetViewPanoramaOptions = {
      position: this.center,
      pov: {
        heading: 319.1574331484312,
        pitch: -2.649914040223763,
      },
    };
    streetView?.setOptions(panoramaOptions);
    streetView?.setVisible(true);
  }

  getMapPropertis() {
    console.log(this.map?.getStreetView().getPov());
  }

  aiv(index: number) {
    let img = document.querySelector(
      `#card-${index} .card-imagem img`
    ) as HTMLImageElement;
    if (img) {
      let width = img.naturalWidth;
      let heigth = img.naturalHeight;

      if (width > heigth) {
        return true;
      }
    }
    return false;
  }

  cardCurrent = 0;


  selectCard(index: number){
    this.cardCurrent = index
  }

  moverSlider(count: number) {
    this.cardCurrent += count;

    let carrosselWrapper = document.querySelector('.card-wrapper') as HTMLDivElement
    let cards = carrosselWrapper.children //document.querySelectorAll('.card-product');

    if (this.cardCurrent > cards.length - 1) {
      this.cardCurrent = 0;
    }

    if (this.cardCurrent < 0) {
      this.cardCurrent = cards.length - 1;
    }

   // console.log(this.cardCurrent)

    for(let i = 0;i < cards.length;i++){
      cards[i].classList.remove('card-current')
    }

    const posicaoCard = (cards[this.cardCurrent] as HTMLDivElement).offsetLeft - carrosselWrapper.offsetLeft

    const posicaoCentralizada = posicaoCard - carrosselWrapper.offsetWidth / 2 + (cards[this.cardCurrent] as HTMLDivElement).offsetWidth / 2;

    carrosselWrapper.scrollTo({
      left: posicaoCentralizada,
      behavior: 'smooth'
    })

    cards[this.cardCurrent].classList.add('card-current')

    /*let widthCurrent = 0;

    cards.forEach((card, index) => {
      let _card = card as HTMLDivElement;


      card.classList.remove('card-current');

      if (index === this.cardCurrent) {
        carrocel.scroll({
          left: widthCurrent - (carrocel.offsetWidth / 2) + (_card.offsetWidth / 2) + 30,
          behavior: 'smooth',
        });

        card.classList.add('card-current')
      }

      widthCurrent += _card.offsetWidth
    });*/


  }

  activeCardCenter(element: HTMLDivElement){

    let cards = element.querySelectorAll('.card-product')
    console.log(cards.length)

    cards.forEach((card, index) => {
      let _card = card as HTMLDivElement;
      _card.classList.remove('card-current')

      let bounds = _card.getBoundingClientRect()
      if(element.offsetWidth / 2 > bounds.x  && element.offsetWidth / 2 < bounds.x + _card.offsetWidth ){
        this.cardCurrent = index
        card.classList.add('card-current')
      }
    })
  }

  comprar(idProduct: number | null | undefined){
    if(idProduct)
    this.router.navigate(['dashboard/menu'], {queryParams : {'action': 'add', 'product_id': idProduct, 'cart_active': true}})
  }

  sendMessage(message: string){
    const numeroContato = '+5581973127515'; // Insira o número do seu contato do WhatsApp aqui
    const mensagem = encodeURIComponent(message); // Codificar a mensagem para evitar problemas de URL

    const url = `https://api.whatsapp.com/send?phone=${numeroContato}&text=${mensagem}`;
    window.open(url);
  }
}
