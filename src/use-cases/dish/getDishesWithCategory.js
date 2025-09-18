'use strict';
const errorHandler = require('../../lib/errorHandler');
const db = require('../../db');
const safeDbCall = require('../../lib/safeDbCall');

const getDishesByCategory = async () => {
   try {
      const category = db('category');
      const query = `
         SELECT 
            c.id AS category_id,
            c.name AS category_name,
            d.id AS dish_id,
            d.name AS dish_name,
            d.price,
            d.description,
            d.time_to_cook,
            d.dish_weight,
            d.dish_status,
            d.composition,
            d.image,
            d.categoryid
         FROM category c
         LEFT JOIN dish d ON c.id = d.categoryid
         ORDER BY c.name, d.name
      `;
      const result = await safeDbCall(() => category.query(query));

      const rows = result && result.rows ? result.rows : [];

      if (!rows || !Array.isArray(rows) || rows.length === 0) {
         console.log('Rows is not an array or is empty:', rows);
         return [];
      }

      const groupedDishes = rows.reduce((acc, row) => {
         const { 
            category_id, 
            category_name, 
            dish_id, 
            dish_name, 
            price, 
            description, 
            time_to_cook, 
            dish_weight, 
            dish_status, 
            composition, 
            image, 
            categoryid 
         } = row;

         let category = acc.find(cat => cat.categoryId === category_id);
         if (!category) {
            category = {
               categoryId: category_id,
               category_name,
               dishes: []
            };
            acc.push(category);
         }

         if (dish_id) {
            category.dishes.push({
               id: dish_id,
               name: dish_name,
               price,
               description,
               time_to_cook,
               dish_weight,
               dish_status,
               composition,
               image,
               categoryid
            });
         }

         return acc;
      }, []);

      return groupedDishes;
   } catch (error) {
      console.error('Error in getDishesByCategory:', error);
      throw errorHandler(error);
   }
};

module.exports = getDishesByCategory;