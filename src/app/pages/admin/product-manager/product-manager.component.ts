import { ProdutoService } from './../../../shared/services/produto.service';
import {
  AfterViewChecked,
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';
import { CategoriaModeloSelector } from 'src/app/model/CategoriaModeloSelector';
import { Produto } from 'src/app/model/Produto.model';
import { ModeloProduto } from 'src/app/model/modelProduct';
import { AutoConcluitComponent } from 'src/app/shared/comps/auto-concluit/auto-concluit.component';
import { ImagemService } from 'src/app/shared/services/imagem.service';

@Component({
  selector: 'app-product-manager',
  templateUrl: './product-manager.component.html',
  styleUrls: ['./product-manager.component.scss'],
})
export class ProductManagerComponent
  implements OnInit, AfterViewInit, AfterViewChecked, OnDestroy
{
  filterModalActive = false;
  mpra = false;
  proRegisterForm!: FormGroup;
  categoriaModeloForm!: FormGroup;
  mproRegisterForm!: FormGroup;
  allErrorVisibleForm: boolean | undefined;
  fileViewImage: File | null = null;
  fileImage: any;
  mutation!: MutationObserver;
  @ViewChild('imgPreviw', { static: false })
  imgPreviw!: ElementRef;
  allProduct: Produto[] = [];
  filterProduct: Produto[] = [];
  productSelected?: Produto;
  filterCategory = 'all';

  modalpm = false;
  modalCatSelect = false;

  preModelProduct: ModeloProduto[] = [];

  preCategoriaModeloSelected?: CategoriaModeloSelector;

  preCategoriaModelo: CategoriaModeloSelector[] = [];

  pEditCatIndex = 0;

  constructor(
    private form: FormBuilder,
    private prodService: ProdutoService,
    private imgService: ImagemService,
    private toastr: ToastrService,
    private sanitizer: DomSanitizer
  ) {}
  ngAfterViewChecked(): void {
    if (this.imgPreviw) {
      let img = this.imgPreviw.nativeElement as HTMLImageElement;

      this.mutation = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (
            mutation.type === 'attributes' &&
            mutation.attributeName === 'src'
          ) {
            const imgWidth = img.width;
            const imgHeight = img.height;

            if (imgHeight > imgWidth) {
              img.style.setProperty('heigth', '100%');
            }
          }
        });
      });
      const config = { attributes: true };
      this.mutation.observe(img, config);
    }
  }
  ngOnDestroy(): void {
    if (this.mutation) {
      this.mutation.disconnect();
    }
  }

  ngOnInit(): void {
    this.proRegisterForm = this.form.group({
      name: [null, [Validators.required]],
      idProduct: [null, [Validators.required]],
      description: [null, [Validators.required]],
      price: [null, [Validators.required]],
      categori: [null, []],
      quant: [null, [Validators.required]],
    });

    this.categoriaModeloForm = this.form.group({
      category: [null, [Validators.required]],
      numberSelections: [1, [Validators.required]],
    });

    this.mproRegisterForm = this.form.group({
      idIndex: [null, [Validators.required]],
      modelName: [null, [Validators.required]],
      amountValue: [null, []],
      inStock: [null, [Validators.required]],
      category: [null, []],
    });

    this.prodService.getAllProduct().subscribe((data) => {
      let products = data;
      products.forEach((prod) => {
        prod.photoObject = [];
        prod.photoUrl?.forEach((photoUrl, i) => {
          if (i === 0) {
            this.imgService.downloadImagem(photoUrl).subscribe((img) => {
              prod.photoObject?.push(
                this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(img))
              );
            });
          }
        });
      });
      this.allProduct = products;
      this.filterProduct = this.allProduct;
    });
  }

  ngAfterViewInit() {}

  getInteractionForm(formGrop: FormGroup, controlName: string) {
    let control = formGrop.get(controlName);
    return control?.touched || control?.dirty || this.allErrorVisibleForm;
  }

  isValidControlForm(formGrop: FormGroup, controlName: string) {
    if (formGrop?.get(controlName)) {
      let control = formGrop.get(controlName);
      if (control?.errors === null) {
        return false;
      }
      return control?.errors && this.getInteractionForm(formGrop, controlName);
    }
    return false;
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    this.fileViewImage = new File([file], file.name, { type: file.type });
    const blob = new Blob([this.fileViewImage], { type: file.type });
    this.fileImage = this.sanitizer.bypassSecurityTrustUrl(
      URL.createObjectURL(blob)
    );
  }

  onFileDrop(event: any) {
    event.preventDefault(); // Impede a ação padrão do navegador
    const file = event.dataTransfer.files[0]; // Seleciona apenas o primeiro arquivo
    this.fileViewImage = new File([file], file.name, { type: file.type });
    const blob = new Blob([this.fileViewImage], { type: file.type });
    this.fileImage = this.sanitizer.bypassSecurityTrustUrl(
      URL.createObjectURL(blob)
    );
  }

  onDragOver(event: any) {
    event.preventDefault(); // Impede a ação padrão do navegador
  }

  salvar() {
    if (this.proRegisterForm.valid) {
      if (this.fileViewImage) {
        this.imgService.uploadImage(this.fileViewImage).subscribe((data) => {
          let prodct = this.getProduct();

          let index = prodct.photoUrl?.findIndex((v, i) => i === 0);

          if (index != -1) {
            prodct.photoUrl![index ?? 0] = data?.['path'];
          } else {
            prodct.photoUrl?.push(data?.['path']);
          }

          prodct.categoriaSelectors = this.preCategoriaModelo;

          this.prodService.salvar(prodct).subscribe({
            next: (data) => {
              data.photoObject = this.fileImage;
              let index = this.allProduct.findIndex(
                (produto) => produto.idProduct === data.idProduct
              );

              data.photoObject = []
              data.photoUrl?.forEach((photoUrl, i) => {
                if (i === 0) {
                  this.imgService.downloadImagem(photoUrl).subscribe((img) => {
                    data.photoObject?.push(
                      this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(img))
                    );
                  });
                }
              });

              if (index !== -1) {
                this.allProduct[index] = data;
              } else {
                this.allProduct.push(data);
              }

              this.fileImage = undefined
              this.fileViewImage = null

              this.toastr.success('Sucesso ao salvar o produto.', 'Sucesso');
              this.mpra = false;
            },
          });
        });
      } else {
        console.log('Aqui Sem imagem');
        let product = this.getProduct();
        product.categoriaSelectors = this.preCategoriaModelo;
        console.log(product);
        this.prodService.salvar(product).subscribe({
          next: (data) => {
            console.log('Aqui Salvou produto');
            data.photoObject = this.fileImage;

            let index = this.allProduct.findIndex(
              (produto) => produto.idProduct === data.idProduct
            );
            let indexFilter = this.filterProduct.findIndex(
              (produto) => produto.idProduct === data.idProduct
            );

            if (index !== -1) {
              this.allProduct[index] = data;
            } else {
              this.allProduct.push(data);
            }

            if (indexFilter !== -1) {
              this.filterProduct[indexFilter] = data;
            }

            this.toastr.success('Sucesso ao salvar o produto.', 'Sucesso');
            this.mpra = false;
          },
        });
      }
    } else {
      console.log(this.proRegisterForm);
      this.allErrorVisibleForm = true;
    }
  }

  adicionarModeloProduto() {
    this.preModelProduct.push(this.getModeloProdutoForm());
    this.modalpm = false;
    this.resetModeloForm();
  }

  removerModeloProduto(
    categoryProd: CategoriaModeloSelector | null | undefined,
    index: number
  ) {
    if (categoryProd) {
      categoryProd.rmodelsProduts = categoryProd.rmodelsProduts?.filter(
        (mp, i) => i !== index
      );
    } else {
      this.preModelProduct = this.preModelProduct.filter(
        (mp, i) => i !== index
      );
    }
  }

  removerCategory(index: number) {
    this.preCategoriaModelo = this.preCategoriaModelo.filter(
      (category, i) => i !== index
    );
  }

  getModeloProdutoForm() {
    const form = this.mproRegisterForm;

    let modeloProduto: ModeloProduto = {
      idIndex: form.get('idIndex')?.value,
      modelName: form.get('modelName')?.value,
      inStock: form.get('inStock')?.value,
      amountValue: form.get('amountValue')?.value,
      category: form.get('category')?.value,
    };

    return modeloProduto;
  }

  getCategoriaModelo() {
    const form = this.categoriaModeloForm;

    let categoria: CategoriaModeloSelector = {
      category: form.get('category')?.value,
      numberSelections: form.get('numberSelections')?.value,
      modeloSelected : []
    };

    return categoria;
  }

  getFile() {
    return this.fileImage;
  }

  isSelected() {
    return this.fileViewImage != null || this.fileImage != undefined;
  }

  getProduct() {
    let form = this.proRegisterForm;
    let prod = this.productSelected;

    let product: Produto = {
      idProduct: form.get('idProduct')?.value,
      photoUrl: prod?.photoUrl ?? [],
      nameProduct: form.get('name')?.value,
      description: form.get('description')?.value,
      price: form.get('price')?.value,
      category: form.get('categori')?.value,
      inStock: form.get('quant')?.value,
      categoriaSelectors: prod?.categoriaSelectors,
    };
    return product;
  }

  editar(idObj: number | null | undefined) {
    let product = this.allProduct.find(({ idProduct }) => idObj === idProduct);
    this.productSelected = product;
    this.preCategoriaModelo = product?.categoriaSelectors ?? [];

    this.proRegisterForm.setValue({
      idProduct: product?.idProduct,
      name: product?.nameProduct,
      description: product?.description,
      price: product?.price,
      categori: product?.category,
      quant: product?.inStock,
    });

    this.fileImage = product?.photoObject?.find((v, i) => i === 0);
    this.mpra = true;
  }

  remover(idObj: number | null | undefined) {
    if (idObj != undefined)
      this.prodService.removeProduct(idObj).subscribe({
        next: () => {
          this.allProduct = this.allProduct.filter(
            (product) => product.idProduct != idObj
          );
          this.toastr.success('Sucesso ao deletar o produto.', 'Sucesso');
        },
        error: () => {
          this.toastr.error('Error ao deletar o produto.', 'Error');
        },
      });
  }

  editarCategoria(index: number) {
    let category = this.preCategoriaModelo.find((categoria, i) => i === index);
    this.preCategoriaModeloSelected = category ?? {};
    this.preModelProduct = category?.rmodelsProduts ?? [];
    this.pEditCatIndex = index;

    this.categoriaModeloForm.setValue({
      category: category?.category,
      numberSelections: category?.numberSelections,
    });

    this.modalCatSelect = true;
  }

  adicionarCategoriaModelo() {
    let categoria = this.getCategoriaModelo();
    categoria.rmodelsProduts = this.preModelProduct;

    // if(this.preCategoriaModeloSelected === undefined){
    //   this.preCategoriaModelo.push(categoria)
    // } else {
    //   this.preCategoriaModelo = this.preCategoriaModelo.filter(categoria => {
    //     if(categoria === this.preCategoriaModeloSelected){
    //       categoria = this.preCategoriaModeloSelected
    //     }
    //   })
    // }

    let index = this.preCategoriaModelo.findIndex((obj, i) => i === this.pEditCatIndex);

    if (!(index != -1)) {
      this.preCategoriaModelo[index] = categoria;
    } else {
      this.preCategoriaModelo.push(categoria);
    }

    this.modalCatSelect = false;
  }

  expandModal() {
    this.allErrorVisibleForm = false;

    this.fileViewImage = null;
    this.fileImage = undefined;

    this.proRegisterForm.setValue({
      name: '',
      idProduct: '',
      description: '',
      price: '',
      categori: '',
      quant: '',
    });
    this.fileImage = undefined;
    this.mpra = true;
    this.preCategoriaModelo = [];
  }

  expandModalCategory() {
    this.preCategoriaModeloSelected = undefined;
  }

  resetForm() {
    this.proRegisterForm = this.form.group({
      name: [null, [Validators.required]],
      idProduct: [null, [Validators.required]],
      description: [null, [Validators.required]],
      price: [null, [Validators.required]],
      categori: [null, []],
      quant: [null, [Validators.required]],
    });
  }

  resetModeloForm() {
    this.mproRegisterForm = this.form.group({
      idIndex: [null, [Validators.required]],
      modelName: [null, [Validators.required]],
      amountValue: [null, []],
      inStock: [null, [Validators.required]],
      category: [null, [Validators.required]],
    });
  }

  resetCategoriaForm() {
    this.categoriaModeloForm = this.form.group({
      category: [null, [Validators.required]],
      numberSelections: [1, [Validators.required]],
    });
  }

  setCategory(category: string) {
    this.filterCategory = category;
    if (category === 'all') {
      this.filterProduct = this.allProduct;
    } else {
      this.filterProduct = this.allProduct.filter(
        (prod) => prod.category == category
      );
    }
    this.filterModalActive = false;
  }

  getAllCetegory() {
    const categorys: string[] = [];
    this.allProduct.forEach((prod) => {
      if (!categorys.includes(prod.category ?? '')) {
        categorys.push(prod.category ?? '');
      }
    });
    return categorys;
  }

  closeModal() {
    this.mpra = false;
    this.resetForm();
    this.cpCurrentStep = 1;
  }

  closeModalModel() {
    this.modalpm = false;
  }

  closeModalCategoria() {
    this.modalCatSelect = false;
    this.pEditCatIndex = -1;
    this.resetCategoriaForm();
    this.preModelProduct = [];
    this.preCategoriaModeloSelected = undefined;
  }

  seachProductos(input: HTMLInputElement) {
    if (input.value !== '') {
      if (this.filterCategory === 'all') {
        this.filterProduct = this.allProduct.filter((prod) =>
          (prod.nameProduct ?? '')
            .toLowerCase()
            .includes(input.value.toLowerCase())
        );
      } else {
        this.filterProduct = this.allProduct.filter(
          (prod) =>
            (prod.nameProduct ?? '')
              .toLowerCase()
              .includes(input.value.toLowerCase()) &&
            prod.category === this.filterCategory
        );
      }
    } else {
      if (this.filterCategory != 'all') {
        this.filterProduct = this.allProduct.filter(
          (prod) => prod.category === this.filterCategory
        );
      } else {
        this.filterProduct = this.allProduct;
      }
    }
  }

  getFilterCategoryName() {
    if (this.filterCategory == 'all') {
      return 'Todos';
    } else {
      return `${this.filterCategory}`;
    }
  }

  cpCurrentStep = 1;

  cpProsseguir() {
    this.cpCurrentStep++;
    (
      document.getElementById('str-' + this.cpCurrentStep) as HTMLInputElement
    ).checked = true;
  }

  cpVoltar() {
    this.cpCurrentStep--;
    (
      document.getElementById('str-' + this.cpCurrentStep) as HTMLInputElement
    ).checked = true;
  }

  cmCurrentStep = 1;

  cmProsseguir() {
    this.cmCurrentStep++;
    (
      document.getElementById('str-m-' + this.cmCurrentStep) as HTMLInputElement
    ).checked = true;
  }

  cmVoltar() {
    this.cmCurrentStep--;
    (
      document.getElementById('str-m-' + this.cmCurrentStep) as HTMLInputElement
    ).checked = true;
  }

  getProductAllIds() {
    let ids: { index: string; indexName?: string }[] = [];

    this.allProduct.forEach((product) => {
      ids.push({ index: product.idProduct + '' });
    });

    return ids;
  }

  getAllProductCategory() {
    let categorys: { index: string; indexName?: string }[] = [];
    let indexes: string[] = [];

    this.allProduct.forEach((product) => {
      if (!indexes.includes(product.category ?? '')) {
        indexes.push(product.category ?? '');
        categorys.push({ index: product.category ?? '' });
      }
    });

    return categorys;
  }

  getAllProductNames() {
    let names: { index: string; indexName?: string }[] = [];

    this.allProduct.forEach((product) => {
      names.push({ index: product.nameProduct ?? '' });
    });

    return names;
  }

  geAllModeloId() {
    let ids: { index: string; indexName?: string }[] = [];

    this.preCategoriaModeloSelected?.rmodelsProduts?.forEach((modelo) => {
      ids.push({ index: modelo.idIndex + '' });
    });

    return ids;
  }

  getAllModeloNames() {
    let names: { index: string; indexName?: string }[] = [];
    let indexes: string[] = [];

    this.preCategoriaModeloSelected?.rmodelsProduts?.forEach((modelo) => {
      if (!indexes.includes(modelo.modelName ?? '')) {
        indexes.push(modelo.modelName ?? '');
        names.push({ index: modelo.modelName + '' });
      }
    });

    return names;
  }

  getFirstImageUrl(produto: Produto) {
    if (produto && produto.photoObject) {

      let img: SafeUrl | null = null

      produto.photoObject.forEach((im, i) => {
        if(i === 0){
          img = im
        }
      })

      return img;
    }

    return null;
  }
}
