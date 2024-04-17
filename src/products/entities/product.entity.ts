import { BeforeInsert, BeforeUpdate, Column, Entity, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ProductImage } from "./product-image.entity";
import { User } from "src/auth/entities/user.entity";

@Entity({ name: 'products'})
export class Product {

    //Metodos validacion

    validateSlug() {
        this.slug = this.slug
            .toLocaleLowerCase().
            replaceAll(" ", "_")
            .replaceAll("'", '')
    }

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('text',
        { unique: true })
    title: string;

    @Column('float',
        { default: 0 })
    price: number;

    @Column({ type: 'text', nullable: true })
    description: string;

    @Column('text',
        { unique: true })
    slug: string;

    @Column('int',
        { default: 0 })
    stock: number;

    @Column('text',
        { array: true })
    sizes: string[]

    @Column('text')
    gender: string;

    @Column('text', {
        array: true,
        default: []
    })
    tags: string[];
    //images
    @OneToMany(
        () => ProductImage,
        productImage => productImage.product,
        { cascade: true, eager: true}
    )
    images?: ProductImage[];
    //Products
    @ManyToOne(
        ()=> User,
        (user)=>user.product,
        {eager:true}
    )
    user:User;
    @BeforeInsert()
    checkSlugInsert() {
        if (!this.slug) {
            this.slug = this.title
        }
        this.validateSlug();
    }
    @BeforeUpdate()
    checkSlugUpdate() {
        this.validateSlug();
    }
}
