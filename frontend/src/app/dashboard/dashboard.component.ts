import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../service/auth.service';
import { ProductService } from '../service/product.service';
import { Mapper } from '../mapping/mapper';
import { ProductDTO } from '../service/_config';
import { MatDialog } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AddProductModalComponent } from '../components/add-product-modal/add-product-modal.component';




@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit{
  displayedColumns: string[] = ['id', 'name', 'price', 'quantity', 'types', 'image', 'action'];
  dataSource: ProductDTO[] = [];
  showModal = false;
  profileName: string|null = sessionStorage.getItem('profileName')!.split(' ')[0];;
  constructor(private service: ProductService,private toastr:ToastrService,private router: Router, private dialog: MatDialog) {
    //this.SetAccesspermission();

  }

  ngOnInit(): void {
    this.getAllProducts(); 
  }

  getAllProducts(): void {
    this.service.getAllProducts().subscribe(
      (response: any) => {
        try {
          const mappedResponse = Mapper.MapperProductListResponse(response);
          this.dataSource = mappedResponse; 
        } catch (error:any) {
          this.toastr.error(error.message || 'Erro desconhecido');
        }
      },
      (error) => {
        this.toastr.error('Erro ao obter produtos');
      }
    );
  }

  deleteProduct(productId: string): void {
    if (confirm('Tem certeza que deseja excluir este produto?')) {
      const dto:ProductDTO = {
        id: productId,
      }
      this.service.deleteProduct(dto).subscribe(
        () => {
          this.getAllProducts();
          this.toastr.success('Produto excluído com sucesso');
        },
        (error) => {
          this.toastr.error('Erro ao excluir produto');
        }
      );
    }
  }

  updateProduct(product:any):void{
    this.showModal = true;
    const dialogRef = this.dialog.open(AddProductModalComponent, {
      width: '400px',
      data: product
    });

    dialogRef.afterClosed().subscribe(result => {
      this.showModal = false;
      if (result === 'success') {
        this.toastr.success('Produto Alterado.');
        this.getAllProducts()
      }
    });
  };

  showAlert(): void {
    this.toastr.warning('Imagem não disponível.', 'Alerta');
  }

  logOut(this: any): void {
    sessionStorage.clear();
    location.reload();
  }

  openModal(): void {
    this.showModal = true;
    const dialogRef = this.dialog.open(AddProductModalComponent, {
      width: '400px'
    });

    dialogRef.afterClosed().subscribe(result => {
      this.showModal = false;
      if (result === 'success') {
        this.toastr.success('Produto Inserido.');
        this.getAllProducts()
      }
    });
  }
}
