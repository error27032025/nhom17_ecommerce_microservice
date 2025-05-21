package com.nhom17.productservice.service;


import com.nhom17.productservice.dto.ProductDto;
import com.nhom17.productservice.helper.ProductMappingHelper;
import com.nhom17.productservice.repository.ProductRepository;
import reactor.core.publisher.Flux;

import java.util.List;

public interface ProductService {
    ProductRepository productRepository = null;
    //    List<ProductDto> findAll();
    Flux<ProductDto> findAll();

    ProductDto findById(final Integer productId);

    ProductDto save(final ProductDto productDto);

    ProductDto update(final ProductDto productDto);

    ProductDto update(final Integer productId, final ProductDto productDto);

    void deleteById(final Integer productId);

    
}