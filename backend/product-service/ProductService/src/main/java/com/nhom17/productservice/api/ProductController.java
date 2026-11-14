package com.nhom17.productservice.api;


import com.nhom17.productservice.dto.ProductDto;
import com.nhom17.productservice.service.ProductService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Flux;



import java.util.List;
@CrossOrigin(origins = "http://localhost:3000")
@Slf4j
@RequiredArgsConstructor
@RestController
@RequestMapping("/api/products") //http://localhost:8086/api/products
public class ProductController {

    @Autowired
    private final ProductService productService;

    // Get a list of all products
    @GetMapping
    public Flux<ProductDto> findAll() {
        return productService.findAll();
    }

    // Get detailed information of a specific product
    @GetMapping("/{productId}") //http://localhost:8086/api/products/1
    public ResponseEntity<ProductDto> findById(@PathVariable("productId")
                                               @NotBlank(message = "Input must not be blank!")
                                               @Valid final String productId) {
        log.info("ProductDto, resource; fetch product by id");
        return ResponseEntity.ok(productService.findById(Integer.parseInt(productId)));
    }



    // CREATE NEW PRODUCT: http://localhost:8086/api/products
    /*
    {
    "productTitle": "Laptop Model A",
    "imageUrl": "http://duytien2905.com/laptopA.jpg",
    "sku": "SKU001",
    "priceUnit": 999.99,
    "quantity": 10,
    "category": {
        "categoryId": 3,
        "categoryTitle": "Laptops",
        "imageUrl": "http://duytien2905.com/laptops.jpg"
    }
}
 */
    @PostMapping
    public ResponseEntity<ProductDto> save(@RequestBody
                                           @NotNull(message = "Input must not be NULL!")
                                           @Valid final ProductDto productDto) {
        log.info("ProductDto, resource; save product");
        return ResponseEntity.ok(productService.save(productDto));
    }

    // Update information of all product
    @PutMapping
    public ResponseEntity<ProductDto> update(@RequestBody
                                             @NotNull(message = "Input must not be NULL!")
                                             @Valid final ProductDto productDto) {
        log.info("ProductDto, resource; update product");
        return ResponseEntity.ok(productService.update(productDto));
    }

    // Update information of a product: http://localhost:8086/api/products/1
    @PutMapping("/{productId}")
    public ResponseEntity<ProductDto> update(@PathVariable("productId")
                                             @NotBlank(message = "Input must not be blank!")
                                             @Valid final String productId,
                                             @RequestBody
                                             @NotNull(message = "Input must not be NULL!")
                                             @Valid final ProductDto productDto) {
        log.info("ProductDto, resource; update product with productId");
        return ResponseEntity.ok(productService.update(Integer.parseInt(productId), productDto));
    }

    // Delete a product http://localhost:8086/api/products/1
    @DeleteMapping("/{productId}")
    public ResponseEntity<Boolean> deleteById(@PathVariable("productId") final String productId) {
        log.info("Boolean, resource; delete product by id");
        productService.deleteById(Integer.parseInt(productId));
        return ResponseEntity.ok(true);
    }

}