import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-category-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './category-list.html',
  styleUrl: './category-list.css',
})
export class CategoryList {
  hoveredCategory: any = null;

sidebarCategories = [
  {
    name: 'Fashion',
    icon: 'fas fa-tshirt',
    id: '2',
    brands: ['LC Waikiki', 'Defacto', 'Activ', 'Adidas', 'American Eagle'],
    subcategories: [
      {
        title: 'Women\'s Fashion',
        products: ['T-Shirts & Tops', 'Dresses', 'Blouses', 'Pants & Jeans', 'Abayas & Jalabiyas', 'Women\'s Shoes', 'Accessories']
      },
      {
        title: 'Men\'s Fashion',
        products: ['T-Shirts & Polos', 'Shirts', 'Hoodies & Sweatshirts', 'Sportswear', 'Pants', 'Slippers & Sandals', 'Underwear']
      },
      {
        title: 'Kids\' Fashion',
        products: ['Boys\' Clothing', 'Girls\' Clothing', 'Shoes', 'Pajamas', 'Baby Clothing']
      }
    ]
  },
  {
    name: 'Phones & Tablets',
    icon: 'fas fa-mobile-alt',
    id: '1',
    brands: ['Apple', 'Samsung', 'Xiaomi', 'Infinix', 'Tecno'],
    subcategories: [
      {
        title: 'Mobile Phones',
        products: ['iPhone', 'Samsung', 'Xiaomi', 'Infinix', 'Tecno']
      },
      {
        title: 'Tablets',
        products: ['iPad', 'Samsung Tabs', 'Lenovo Tablets']
      },
      {
        title: 'Accessories',
        products: ['Chargers', 'Cases', 'Screen Protectors']
      }
    ]
  },
  {
    name: 'Health & Beauty',
    icon: 'fas fa-heartbeat',
    id: '4',
    brands: ['L\'Oréal', 'Maybelline', 'Nivea', 'Dove', 'The Ordinary'],
    subcategories: [
      {
        title: 'Makeup',
        products: ['Foundation', 'Mascara', 'Lipstick', 'Palettes']
      },
      {
        title: 'Skincare',
        products: ['Facial Cleansers', 'Creams', 'Sunscreen']
      },
      {
        title: 'Haircare',
        products: ['Shampoo', 'Conditioner', 'Oils']
      },
      {
        title: 'Perfumes',
        products: ['Men\'s Fragrances', 'Women\'s Fragrances']
      }
    ]
  },
  {
    name: 'Home & Furniture',
    icon: 'fas fa-couch',
    id: '3',
    brands: ['IKEA', 'Home Centre', 'Inspire', 'Roche Bobois'],
    subcategories: [
      {
        title: 'Furniture',
        products: ['Beds', 'Sofas', 'Dining Tables', 'Chairs']
      },
      {
        title: 'Home Decor',
        products: ['Curtains', 'Wall Art', 'Rugs']
      },
      {
        title: 'Bedding',
        products: ['Bed Sheets', 'Pillows', 'Blankets']
      }
    ]
  },
  {
    name: 'Home Appliances',
    icon: 'fas fa-blender',
    id: '6',
    brands: ['Philips', 'LG', 'Toshiba', 'Samsung', 'Moulinex'],
    subcategories: [
      {
        title: 'Kitchen Appliances',
        products: ['Blenders', 'Microwaves', 'Ovens']
      },
      {
        title: 'Home Appliances',
        products: ['Washing Machines', 'Refrigerators', 'Water Heaters']
      }
    ]
  },
  {
    name: 'Supermarket',
    icon: 'fas fa-shopping-basket',
    id: '9',
    brands: ['Nestle', 'Pepsi', 'Kellogg\'s', 'Lipton', 'Dettol'],
    subcategories: [
      {
        title: 'Food',
        products: ['Rice', 'Pasta', 'Snacks', 'Canned Foods']
      },
      {
        title: 'Drinks',
        products: ['Water', 'Juices', 'Soft Drinks']
      },
      {
        title: 'Personal Care',
        products: ['Toothpaste', 'Shampoo', 'Soap']
      }
    ]
  },
  {
    name: 'Computing',
    icon: 'fas fa-laptop',
    id: '7',
    brands: ['HP', 'Dell', 'Apple', 'Lenovo', 'Logitech'],
    subcategories: [
      {
        title: 'Laptops',
        products: ['HP', 'Dell', 'Lenovo', 'Apple']
      },
      {
        title: 'Accessories',
        products: ['Keyboards', 'Mice', 'Bags']
      },
      {
        title: 'Printers',
        products: ['Inkjet', 'Laser', 'All-in-One']
      }
    ]
  },
  {
    name: 'Gaming',
    icon: 'fas fa-gamepad',
    id: '8',
    brands: ['PlayStation', 'Xbox', 'Nintendo', 'Razer', 'Logitech G'],
    subcategories: [
      {
        title: 'Gaming Consoles',
        products: ['PlayStation', 'Xbox', 'Nintendo Switch']
      },
      {
        title: 'Games',
        products: ['FIFA', 'Call of Duty', 'Fortnite']
      },
      {
        title: 'Accessories',
        products: ['Controllers', 'Headsets', 'VR Devices']
      }
    ]
  },
  {
    name: 'Sports Goods',
    icon: 'fas fa-running',
    id: '10',
    brands: ['Nike', 'Adidas', 'Puma', 'Reebok', 'Under Armour'],
    subcategories: [
      {
        title: 'Fitness Equipment',
        products: ['Treadmills', 'Dumbbells', 'Yoga Mats']
      },
      {
        title: 'Sportswear',
        products: ['Running Shoes', 'Shorts', 'T-Shirts']
      }
    ]
  },
  {
    name: 'Other Departments',
    icon: 'fas fa-ellipsis-h',
    id: '11',
    subcategories: [
      {
        title: 'Books & Stationery',
        products: ['Books', 'Pens', 'Notebooks']
      },
      {
        title: 'Pet Supplies',
        products: ['Dog Food', 'Cat Toys', 'Bird Cages']
      }
    ]
  }
];

}
