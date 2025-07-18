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
      name: 'الأزياء',
      icon: 'fas fa-tshirt',
      id: '2',
      brands: ['LC Waikiki', 'Defacto', 'Activ', 'Adidas', 'American Eagle'],
      subcategories: [
        {
          title: 'أزياء حريمي',
          products: ['تيشيرت و توبس', 'فساتين', 'بلايز', 'بناطيل و جينز', 'عبايات و جلابيات', 'أحذية حريمي', 'إكسسوارات']
        },
        {
          title: 'أزياء رجالي',
          products: ['تي شيرتات و بولو', 'قمصان', 'هوديز و سويتشيرتات', 'ملابس رياضية', 'بناطيل', 'شباشب و نعال', 'ملابس داخلية']
        },
        {
          title: 'أزياء الأطفال',
          products: ['ملابس الأولاد', 'ملابس البنات', 'أحذية', 'بيجامات', 'ملابس المواليد']
        }
      ]
    },
    {
      name: 'هواتف وأجهزة لوحية',
      icon: 'fas fa-mobile-alt',
      id: '1',
      brands: ['Apple', 'Samsung', 'Xiaomi', 'Infinix', 'Tecno'],
      subcategories: [
        {
          title: 'الهواتف المحمولة',
          products: ['iPhone', 'Samsung', 'Xiaomi', 'Infinix', 'Tecno']
        },
        {
          title: 'الأجهزة اللوحية',
          products: ['iPad', 'Samsung Tabs', 'Lenovo Tablets']
        },
        {
          title: 'الإكسسوارات',
          products: ['الشواحن', 'الجرابات', 'حماة الشاشة']
        }
      ]
    },
    {
      name: 'الصحة والجمال',
      icon: 'fas fa-heartbeat',
      id: '4',
      brands: ['L\'Oréal', 'Maybelline', 'Nivea', 'Dove', 'The Ordinary'],
      subcategories: [
        {
          title: 'مكياج',
          products: ['كريم الأساس', 'ماسكارا', 'أحمر الشفاه', 'اللوحات']
        },
        {
          title: 'العناية بالبشرة',
          products: ['غسول الوجه', 'الكريمات', 'واقي الشمس']
        },
        {
          title: 'العناية بالشعر',
          products: ['الشامبو', 'البلسم', 'الزيوت']
        },
        {
          title: 'العطور',
          products: ['عطور رجالية', 'عطور نسائية']
        }
      ]
    },
    {
      name: 'المنزل والأثاث',
      icon: 'fas fa-couch',
      id: '3',
      brands: ['IKEA', 'Home Centre', 'Inspire', 'Roche Bobois'],
      subcategories: [
        {
          title: 'الأثاث',
          products: ['الأسِرّة', 'الأرائك', 'طاولات الطعام', 'الكراسي']
        },
        {
          title: 'ديكور المنزل',
          products: ['الستائر', 'اللوحات الجدارية', 'السجاد']
        },
        {
          title: 'مفروشات السرير',
          products: ['مفارش السرير', 'الوسائد', 'البطانيات']
        }
      ]
    },
    {
      name: 'الأجهزة المنزلية',
      icon: 'fas fa-blender',
      id: '6',
      brands: ['Philips', 'LG', 'Toshiba', 'Samsung', 'Moulinex'],
      subcategories: [
        {
          title: 'أجهزة المطبخ',
          products: ['الخلاطات', 'الميكروويف', 'الأفران']
        },
        {
          title: 'أجهزة منزلية',
          products: ['الغسالات', 'الثلاجات', 'سخانات المياه']
        }
      ]
    },
    {
      name: 'السوبرماركت',
      icon: 'fas fa-shopping-basket',
      id: '9',
      brands: ['Nestle', 'Pepsi', 'Kellogg\'s', 'Lipton', 'Dettol'],
      subcategories: [
        {
          title: 'الطعام',
          products: ['الأرز', 'المعكرونة', 'الوجبات الخفيفة', 'المعلبات']
        },
        {
          title: 'المشروبات',
          products: ['الماء', 'العصائر', 'المشروبات الغازية']
        },
        {
          title: 'العناية الشخصية',
          products: ['معجون الأسنان', 'الشامبو', 'الصابون']
        }
      ]
    },
    {
      name: 'الحوسبة',
      icon: 'fas fa-laptop',
      id: '7',
      brands: ['HP', 'Dell', 'Apple', 'Lenovo', 'Logitech'],
      subcategories: [
        {
          title: 'أجهزة الكمبيوتر المحمولة',
          products: ['HP', 'Dell', 'Lenovo', 'Apple']
        },
        {
          title: 'الإكسسوارات',
          products: ['لوحات المفاتيح', 'الفأرات', 'الحقائب']
        },
        {
          title: 'الطابعات',
          products: ['Inkjet', 'Laser', 'All-in-One']
        }
      ]
    },
    {
      name: 'الألعاب',
      icon: 'fas fa-gamepad',
      id: '8',
      brands: ['PlayStation', 'Xbox', 'Nintendo', 'Razer', 'Logitech G'],
      subcategories: [
        {
          title: 'أجهزة اللعب',
          products: ['PlayStation', 'Xbox', 'Nintendo Switch']
        },
        {
          title: 'الألعاب',
          products: ['FIFA', 'Call of Duty', 'Fortnite']
        },
        {
          title: 'الإكسسوارات',
          products: ['أجهزة التحكم', 'سماعات الرأس', 'أجهزة الواقع الافتراضي']
        }
      ]
    },
    {
      name: 'السلع الرياضية',
      icon: 'fas fa-running',
      id: '10',
      brands: ['Nike', 'Adidas', 'Puma', 'Reebok', 'Under Armour'],
      subcategories: [
        {
          title: 'اللياقة البدنية',
          products: ['أجهزة الجري', 'الدمبلز', 'حصائر اليوغا']
        },
        {
          title: 'الملابس الرياضية',
          products: ['أحذية الجري', 'الشورتات', 'التيشيرتات']
        }
      ]
    },
    {
      name: 'أقسام أخرى',
      icon: 'fas fa-ellipsis-h',
      id: '11',
      subcategories: [
        {
          title: 'الكتب والقرطاسية',
          products: ['الكتب', 'الأقلام', 'الدفاتر']
        },
        {
          title: 'مستلزمات الحيوانات',
          products: ['طعام الكلاب', 'ألعاب القطط', 'أقفاص الطيور']
        }
      ]
    }
  ];
}
