package com.travelbuddy.repository;

import com.travelbuddy.model.Hotel;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;

@Repository
public class HotelRepository {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    private final RowMapper<Hotel> hotelRowMapper = new RowMapper<Hotel>() {
        @Override
        public Hotel mapRow(ResultSet rs, int rowNum) throws SQLException {
            Hotel hotel = new Hotel();
            hotel.setName(rs.getString("name"));
            hotel.setNote(rs.getString("note"));
            return hotel;
        }
    };

    public List<Hotel> findByDestinationIdAndTier(String destinationId, String tier) {
        String sql = "SELECT name, note FROM hotels WHERE destination_id = ? AND tier = ? ORDER BY name";
        return jdbcTemplate.query(sql, hotelRowMapper, destinationId, tier);
    }

    public List<Hotel> findByDestinationId(String destinationId) {
        String sql = "SELECT name, note FROM hotels WHERE destination_id = ? ORDER BY tier, name";
        return jdbcTemplate.query(sql, hotelRowMapper, destinationId);
    }

    public int save(Hotel hotel, String destinationId, String tier) {
        String sql = "INSERT INTO hotels (destination_id, tier, name, note) VALUES (?, ?, ?, ?)";
        return jdbcTemplate.update(sql, destinationId, tier, hotel.getName(), hotel.getNote());
    }

    public int deleteByDestinationId(String destinationId) {
        String sql = "DELETE FROM hotels WHERE destination_id = ?";
        return jdbcTemplate.update(sql, destinationId);
    }

    public int deleteByDestinationIdAndTier(String destinationId, String tier) {
        String sql = "DELETE FROM hotels WHERE destination_id = ? AND tier = ?";
        return jdbcTemplate.update(sql, destinationId, tier);
    }
}

